import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PostCard from "../components/PostCard";

const Home = () => {
  const [recentPosts, setRecentPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true); // 定义 loading 状态
  const [loadingProgress, setLoadingProgress] = useState(0); // 定义加载进度状态

  const fetchUser = async (userId) => {
    try {
      const res = await fetch(`/api/user/getusers?userId=${userId}`);
      if (res.ok) {
        const { users } = await res.json();
        //console.log(users);
        return users[0];
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
            <span className="absolute text-xl font-bold">{Math.round(loadingProgress)}%</span>
          </div>
          <p className="text-2xl font-bold">Loading...</p>
        </div>
      </div>
    );
  }

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

      {/* 最近的文章 */}
      <div className="mb-12">
        <h2 className="text-4xl font-bold mb-8">Recent blog posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* 第一篇文章 */}
          {recentPosts.length > 0 && (
            <div
              key={recentPosts[0]._id}
              className="md:col-span-3 row-span-2 bg-white rounded-lg shadow-md overflow-hidden group transform transition-transform duration-300 hover:scale-105"
            >
              <img
                src={recentPosts[0].image}
                alt={recentPosts[0].title}
                className="w-full h-48 md:h-96 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <img
                    src={recentPosts[0].profilePicture}
                    alt={recentPosts[0].username}
                    className="w-8 h-8 rounded-full object-cover mr-2"
                  />
                  <span className="font-semibold">
                    {recentPosts[0].username}
                  </span>
                  <span className="mx-2">•</span>
                  <span>
                    {recentPosts[0].createdAt &&
                      new Date(recentPosts[0].createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mt-2">
                  <Link to={`/post/${recentPosts[0].slug}`}>
                    {recentPosts[0].title}
                  </Link>
                </h3>
                <p className="mt-4 text-gray-600">
                  {recentPosts[0].content.substring(0, 150)}...
                </p>
                <div className="mt-4">
                  <span className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                    {recentPosts[0].category}
                  </span>
                </div>

                <Link
                  to={`/post/${recentPosts[0].slug}`}
                  className="z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2"
                >
                  Read the article
                </Link>
              </div>
            </div>
          )}

          {/* 第三篇和第四篇文章 */}
          <div className="flex flex-col gap-8 md:row-span-2 md:col-span-2">
            {recentPosts.slice(2, 4).map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-lg shadow-md overflow-hidden flex group transform transition-transform duration-300 hover:scale-105"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-1/2 h-auto object-cover"
                />
                <div className="p-6 flex flex-col justify-between">
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
                      {post.content.substring(0, 150)}...
                    </p>
                    <div className="mt-4">
                      <span className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
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

          {/* 第二篇文章 */}
          {recentPosts.length > 1 && (
            <div
              key={recentPosts[1]._id}
              className="md:col-span-5 bg-white rounded-lg shadow-md overflow-hidden group transform transition-transform duration-300 hover:scale-105 flex"
            >
              <img
                src={recentPosts[1].image}
                alt={recentPosts[1].title}
                className="w-1/2 h-auto object-cover"
              />
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <img
                      src={recentPosts[1].profilePicture}
                      alt={recentPosts[1].username}
                      className="w-8 h-8 rounded-full object-cover mr-2"
                    />
                    <span className="font-semibold">
                      {recentPosts[1].username}
                    </span>
                    <span className="mx-2">•</span>
                    <span>
                      {recentPosts[1].createdAt &&
                        new Date(recentPosts[1].createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mt-2">
                    <Link to={`/post/${recentPosts[1].slug}`}>
                      {recentPosts[1].title}
                    </Link>
                  </h3>
                  <p className="mt-4 text-gray-600">
                    {recentPosts[1].content.substring(0, 150)}...
                  </p>
                  <div className="mt-4">
                    <span className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                      {recentPosts[1].category}
                    </span>
                  </div>
                </div>
                <Link
                  to={`/post/${recentPosts[1].slug}`}
                  className="z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2"
                >
                  Read the article
                </Link>
              </div>
            </div>
          )}
        </div>
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
                    <span className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
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
