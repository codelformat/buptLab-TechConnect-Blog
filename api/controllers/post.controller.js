// /api/controllers/post.controller.js
import Post from '../models/post.model.js';
import Comment from '../models/comment.model.js'
import Click from '../models/click.model.js';
import { errorHandler } from '../utils/error.js';
import pinyin from 'pinyin';

export const create = async (req, res, next) => {
  // if (!req.user.isAdmin) {
  //   return next(errorHandler(403, 'You are not allowed to create a post'));
  // }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }

  const slug = pinyin.pinyin(req.body.title, {
    style: pinyin.STYLE_NORMAL, // 普通拼音风格，不包含声调
    heteronym: false            // 禁用多音字功能
  })
    .flat()                     // 将结果从二维数组转换为一维数组
    .join('-')                  // 使用 '-' 连接所有拼音
    .replace(/[^a-zA-Z0-9-]/g, '-') // 替换任何非字母数字字符为 '-'
    .toLowerCase();             // 转换为小写
  
  const updateTime = Date.now();
  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
    updateTime: updateTime,
  });
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};

export const getposts = async (req, res, next) => {
  try {
    const limit0 = req.body.limit;
    //console.log(req);
    const startIndex = parseInt(req.query.startIndex) || 0;
    //const limit = parseInt(req.query.limit) || 9;
    const limit = parseInt(limit0);
    console.log('limit', limit);

    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          // { content: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    })
      .sort({ updateTime: sortDirection })
      .skip(startIndex)
      .limit(limit);

    // console.log(posts)

    const totalPosts = await Post.countDocuments();


    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    const clickNumByDay = await Post.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          totalClicks: { $sum: "$clickNum" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
      },
      {
        $project: {
          _id: 0,
          date: {
            $concat: [
              { $toString: "$_id.year" }, "-",
              { $toString: "$_id.month" }, "-",
              { $toString: "$_id.day" }
            ]
          },
          totalClicks: 1
        }
      }
    ]);

    // console.log(clickNumByDay);


    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
      clickNumByDay
    });
  } catch (error) {
    next(error);
  }
};

export const deletepost = async (req, res, next) => {
  const { user, postId } = req.body

  if (!user.isAdmin && user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this post!!'));
  }
  try {
    // 先找到post
    const post = await Post.findById(postId);
    console.log(post)
    /// 再找到对应外键postId的Comment
    Comment.find({ postId: post._id })
      .then(comments => {
        console.log(comments)

        // 若找不到相应的comments
        if (comments.length === 0) {
          console.log("post deletion: no comments related found.")
          return;
        }
        // 删除相关的comments
        comments.forEach(async (comment) => {
          await Comment.findByIdAndDelete(comment._id);
        });

        console.log("Post deletion: comments deletion done")
      })
      .catch(err => {
        console.log(err);
        next(err);
      });

    /// 再找到对应外键postId的Click
    Click.find({ postId: post._id })
    .then(clicks=> {
      console.log(clicks)

      // 找不到相关的click
      if (clicks.length === 0) {
        console.log("post deletion: no clicks related found.")
        return;
      }

      // 删除相关的clicks
      clicks.forEach(async (click) => {
        await Click.findByIdAndDelete(click._id);
      });
      console.log("clicks deletion done")
    })
    .catch(err => {
      console.log(err);
      next(err);
    });

    /// 最后删除post
    await Post.findByIdAndDelete(postId);
    res.status(200).json('The post has been deleted');
  } catch (error) {
    next(error);
  }
};

export const updatepost = async (req, res, next) => {
  try {
    const { title, content, category, image } = req.body;

    /// 先更新Post
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: title,
          content: content,
          category: category,
          image: image,
          updatedTime: Date.now(),
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

export const get_required_post = async (req, res, next) => {
  const { postId } = req.body;
  // console.log('get_required_post 方法内部:')
  // console.log(postId);

  // if (!user.isAdmin || user.id !== req.params.userId) {
  //   return next(errorHandler(403, 'You are not allowed to update this post'));
  // }
  try {
    const post = await Post.find({ _id: postId });
    console.log('find之后一行')
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};


export const getpostBySlug = async (req, res, next) => {
  const { slug } = req.body;
  //console.log('getpostBySlug内部方法:',slug)
  try {
    const post = await Post.findOne({ slug: slug });
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
}

export const getPostsCount = async (req, res, next) => {
  try {
    const count = await Post.countDocuments();
    res.status(200).json({ count });
    //console.log(res);
  }
  catch (error) {
    next(error);
  }
}


export const getpostsByCategory = async (req, res, next) => {
  const { category } = req.body;
  try {
    const posts = await Post.find({ category: category });
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
}

export const incPostClick = async (req, res, next) => {
  const { postId } = req.body;
  try {
    const post = await Post.findById(postId);
    post.clickNum++;
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
}

export const getRecentPosts = async (req, res, next) => {
  const sortDirection = req.query.order === 'asc' ? 1 : -1;
  const limit = req.query.limit || 3;
  const startIndex = req.query.startIndex || 0;
  try {
    const posts = await Post.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    res.status(200).json(posts);
  }
  catch (error) {
    next(error);
  }
}