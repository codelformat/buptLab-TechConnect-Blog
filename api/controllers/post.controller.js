import Post from '../models/post.model.js';
import { errorHandler } from '../utils/error.js';
import pinyin from 'pinyin'; 

export const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to create a post'));
  }
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
  // const slug = req.body.title
  //   .split(' ')
  //   .join('-')
  //   .toLowerCase()
  //   .replace(/[^a-zA-Z0-9-]/g, '');
  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
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
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { content: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

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

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

export const deletepost = async (req, res, next) => {
  const {user, postId} = req.body
  console.log('user')
  console.log(user)
  // if (!req.user.isAdmin || req.user.id !== req.params.userId) {
  //   return next(errorHandler(403, 'You are not allowed to delete this post'));
  // }
  if(!user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to delete this post!!'));
  }
  try {
    await Post.findByIdAndDelete(postId);
    res.status(200).json('The post has been deleted');
  } catch (error) {
    next(error);
  }
};

export const updatepost = async (req, res, next) => {
  try {
    const { title,content,category,image } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: title,
          content: content,
          category: category,
          image: image,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};
// export const updatepost = async (req, res, next) => {
//   // if (!req.user.isAdmin || req.user.id !== req.params.userId) {
//   //   return next(errorHandler(403, 'You are not allowed to update this post'));
//   // }

//   try {
//     ////const { title,content,category,image } = req.body;
//     const updatedPost = await Post.findByIdAndUpdate(
//       req.params.postId,
//       {
//         $set: {
//           title: req.body.title,
//           content: req.body.content,
//           category: req.body.category,
//           image: req.body.image,
//         },
//       },
//       { new: true }
//     );
//     res.status(200).json(updatedPost);
//   } catch (error) {
//     next(error);
//   }
// };

export const get_required_post = async (req, res, next) => {
  const { postId } = req.body;
  console.log('get_required_post 方法内部:')
  console.log(postId);

  // if (!user.isAdmin || user.id !== req.params.userId) {
  //   return next(errorHandler(403, 'You are not allowed to update this post'));
  // }
  try {
    const post =await Post.find({ _id: postId });
    console.log('find之后一行')
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const getpostBySlug = async (req, res, next) => {
  const { slug } = req.body;
  console.log('getpostBySlug内部方法:',slug)
  try {
    const post = await Post.findOne({ slug: slug });
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
}