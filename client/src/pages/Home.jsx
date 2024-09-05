import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const [recentPosts, setRecentPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true); // 定义 loading 状态
  const [loadingProgress, setLoadingProgress] = useState(0); // 定义加载进度状态

  // 定义类别颜色映射
  const categoryColors = {
    "React.js": "bg-blue-200 text-blue-800",
    "Next.js": "bg-green-200 text-green-800",
    javascript: "bg-yellow-200 text-yellow-800",
    uncategorized: "bg-gray-200 text-gray-800",
  };

  const fetchUser = async (userId) => {
    try {
      console.log("fetching users...");
      const res = await fetch(`/api/user/${userId}`);
      console.log(res.ok);
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        return data;
      } else {
        console.error("Failed to fetch username");
      }
    } catch (error) {
      console.error("Error fetching username:", error);
    }
    return null;
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ limit: 10 }), // 获取最多12篇文章
        });
        setLoadingProgress(30); // 更新进度到30%
        if (res.ok) {
          const data = await res.json();
          console.log(data.posts);
          const postsWithUserDetails = await Promise.all(
            data.posts.map(async (post, index, array) => {
              const user = await fetchUser(post.userId);
              // 更新进度，计算每个用户信息加载后更新的进度
              setLoadingProgress(30 + 50 * ((index + 1) / array.length));
              console.log(user.profilePicture);
              return {
                ...post,
                username: user.username,
                profilePicture: user.profilePicture,
              };
            })
          );

          setRecentPosts(postsWithUserDetails.slice(0, 4)); // 最近的4篇文章
          setAllPosts(postsWithUserDetails.slice(0, 6)); // 所有的文章
          setLoadingProgress(100); // 更新进度到100%
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setTimeout(() => setLoading(false), 500); // 延迟一点时间以确保用户能看到100%
      }
    };

    fetchPosts();
  }, []);

  // 日期格式化函数
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="relative flex flex-col items-center">
          {/* 旋转加载环 */}
          <div className="loader relative ease-linear rounded-full border-8 border-t-8 border-gray-200 h-24 w-24 mb-4 flex items-center justify-center">
            <span className="absolute text-xl font-bold">
              {Math.round(loadingProgress)}%
            </span>
          </div>
          <p className="text-2xl font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  // 设置轮播图的参数
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="max-w-7xl mx-auto px-5 py-10">
      {/* 顶部标题部分 */}
      <div className="text-center mb-12">
        {/* 上方分割线 */}
        <hr className="border-t-2 border-black mb-8" />

        {/* 标题和分割线之间的容器 */}
        <div className="relative">
          {/* 标题 */}
          <h1 className="text-6xl font-extrabold mb-4">Welcome to my Blog</h1>

          {/* 下方分割线 */}
          <hr className="border-t-2 border-black mt-8" />
        </div>

        {/* 描述部分 */}
        <p className="text-lg text-gray-600 mt-8 mb-10">
          Here you’ll find a variety of articles and tutorials on topics such as
          web development, software engineering, and programming languages.
        </p>

        {/* 按钮部分 */}
        <Link
          to="/posts"
          className="inline-block bg-black text-white py-3 px-6 rounded-full text-lg font-semibold hover:bg-gray-800 transition-colors duration-200"
        >
          View all posts
        </Link>
      </div>

      {/* 最近的文章轮播图 */}
      <div className="mb-12">
        <h2 className="text-4xl font-bold mb-8">Recent blog posts</h2>
        <Slider {...sliderSettings}>
          {recentPosts.map((post) => (
            <div
              key={post._id}
              className="relative group bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-center">
                  <div className="flex items-center justify-center text-gray-300 text-sm mb-2">
                    <img
                      src={post.profilePicture}
                      alt={post.username}
                      className="w-8 h-8 rounded-full object-cover mr-2"
                    />
                    <span className="font-semibold">{post.username}</span>
                    <span className="mx-2">•</span>
                    <span>{post.createdAt && formatDate(post.createdAt)}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mt-2">
                    <Link to={`/post/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-4 text-gray-300 hidden md:block">
                    {post.content.substring(0, 150)}...
                  </p>
                  <div className="mt-4">
                    <span
                      className={`inline-block ${
                        categoryColors[post.category]
                      } text-xs font-semibold mr-2 px-2.5 py-0.5 rounded`}
                    >
                      {post.category}
                    </span>
                  </div>
                  <Link
                    to={`/post/${post.slug}`}
                    className="z-10 mt-4 inline-block px-6 py-2 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center rounded-md"
                  >
                    Read the article
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* 所有文章 */}
      <div>
        <h2 className="text-3xl font-bold mb-8">All blog posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-lg shadow-md overflow-hidden group transform transition-transform duration-300 hover:scale-105"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <img
                      src={post.profilePicture}
                      alt={post.username}
                      className="w-8 h-8 rounded-full object-cover mr-2"
                    />
                    <span className="font-semibold">{post.username}</span>
                    <span className="mx-2">•</span>
                    <span>
                      {post.createdAt &&
                        new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mt-2">
                    <Link to={`/post/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="mt-4 text-gray-600">
                    {post.content.substring(0, 100)}...
                  </p>
                  <div className="mt-4">
                    <span
                      className={`inline-block ${
                        categoryColors[post.category]
                      } text-xs font-semibold mr-2 px-2.5 py-0.5 rounded`}
                    >
                      {post.category}
                    </span>
                  </div>
                </div>
                <Link
                  to={`/post/${post.slug}`}
                  className="z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2"
                >
                  Read the article
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Show More 按钮 */}
        <div className="flex justify-center mt-10">
          <Link
            to="/posts"
            className="inline-block bg-blue-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-200 shadow-lg"
          >
            Show More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
