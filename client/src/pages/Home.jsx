import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PostCard from "../components/PostCard";

const Home = () => {
  const [recentPosts, setRecentPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);

  const fetchUsername = async (userId) => {
    try {
      const res = await fetch(`/api/user/getusers?userId=${userId}`);
      if (res.ok) {
        const user = await res.json();
        return user.username;
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
          body: JSON.stringify({ limit: 12 }), // 获取最多12篇文章
        });
        if (res.ok) {
          const data = await res.json();
          const postsWithUsernames = await Promise.all(
            data.posts.map(async (post) => {
              const username = await fetchUsername(post.userId);
              return { ...post, username };
            })
          );
          setRecentPosts(postsWithUsernames.slice(0, 4)); // 最近的4篇文章
          setAllPosts(postsWithUsernames); // 所有的文章
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchPosts();
  }, []);

  // 日期格式化函数
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-7xl mx-auto px-5 py-10">
      {/* 顶部标题部分 */}
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold mb-4">Welcome to my Blog</h1>
        <p className="text-lg text-gray-600">
          Here you’ll find a variety of articles and tutorials on topics such as
          web development, software engineering, and programming languages.
        </p>
        <Link
          to="/posts"
          className="mt-6 inline-block bg-black text-white py-3 px-6 rounded-full text-lg"
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
                className="w-full h-48 md:h-64 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center text-gray-600 text-sm mb-2">
                  {/* 显示用户名 */}
                  <span className="font-semibold">
                    {recentPosts[0].username}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(recentPosts[0].createdAt)}</span>
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
                      <span className="font-semibold">{post.username}</span>
                      <span className="mx-2">•</span>
                      <span>{formatDate(post.createdAt)}</span>
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
                    <span className="font-semibold">
                      {recentPosts[1].username}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(recentPosts[1].createdAt)}</span>
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
                    <span className="font-semibold">{post.username}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(post.createdAt)}</span>
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
      </div>
    </div>
  );
};

export default Home;
