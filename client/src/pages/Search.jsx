// /client/src/pages/Search.jsx
import { Button, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineRight, AiOutlineLeft } from 'react-icons/ai'; // Import the arrow icons
import PostCard from '../components/PostCard';

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'uncategorized',
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [isSidebarVisible, setSidebarVisible] = useState(false); // State to control sidebar visibility
  const [isDarkMode, setDarkMode] = useState(false); // State for night mode

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const sortFromUrl = urlParams.get('sort');
    const categoryFromUrl = urlParams.get('category');
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/post/getposts?${searchQuery}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      setPosts(data.posts);
      setLoading(false);
      setShowMore(data.posts.length === 9);
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === 'searchTerm') {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === 'sort') {
      const order = e.target.value || 'desc';
      setSidebarData({ ...sidebarData, sort: order });
    }
    if (e.target.id === 'category') {
      const category = e.target.value || 'uncategorized';
      setSidebarData({ ...sidebarData, category });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams({
      searchTerm: sidebarData.searchTerm,
      sort: sidebarData.sort,
      category: sidebarData.category,
    });
    navigate(`/search?${urlParams.toString()}`);
  };

  const handleShowMore = async () => {
    const startIndex = posts.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/post/getposts?${searchQuery}`);
    if (res.ok) {
      const data = await res.json();
      setPosts((prevPosts) => [...prevPosts, ...data.posts]);
      setShowMore(data.posts.length === 9);
    }
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen`}>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg p-7 border-r border-gray-500 transition-transform transform ${
          isSidebarVisible ? 'translate-x-0' : '-translate-x-full'
        }`}
        onMouseLeave={() => setSidebarVisible(false)}
      >
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              搜索项:
            </label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">分类:</label>
            <Select
              onChange={handleChange}
              value={sidebarData.sort}
              id="sort"
            >
              <option value="desc">最新</option>
              <option value="asc">最远</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">分类:</label>
            <Select
              onChange={handleChange}
              value={sidebarData.category}
              id="category"
            >
              <option value="uncategorized">其他</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
              <option value="javascript">JavaScript</option>
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone="purpleToPink">
           筛选
          </Button>
        </form>
        {/* Toggle Arrow inside Sidebar */}
        <button
          onClick={() => setSidebarVisible(false)}
          className="absolute top-1/2 right-0 transform -translate-y-1/2 p-2"
        >
          <AiOutlineLeft size={24} />
        </button>
      </div>

      {/* Toggle Arrow outside Sidebar */}
      {!isSidebarVisible && (
        <button
          onClick={() => setSidebarVisible(true)}
          className="fixed top-1/2 left-0 transform -translate-y-1/2 z-50 p-2"
        >
          <AiOutlineRight size={24} />
        </button>
      )}

      {/* Main Content */}
      <div className={`transition-all w-full ${isSidebarVisible ? 'ml-64' : 'ml-40'}`}>
      <div className="text-center">
  <h1 className="text-3xl font-semibold mt-5 mr-80">
    Posts results
  </h1>
</div>


        <br></br>
        <p className="text-gray-500 text-center mr-80">
            Welcome to the Posts results page! Here you can find all the posts that match your search query.
            </p>
            <br></br>
        <div className="p-7 flex flex-wrap gap-4 items-center">
          {!loading && posts.length === 0 && (
            <div className="flex justify-center">
            <p className="text-xl text-gray-500">No posts found.</p>
          </div>
          )}
          {loading && <div className="flex justify-center">
  {loading && <p className="text-xl text-gray-500">Loading...</p>}
</div>}
          {!loading &&
            posts &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
          {showMore && (
            <button
              onClick={handleShowMore}
              className="text-teal-500 text-lg hover:underline p-7 w-full"
            >
              Show More
            </button>
          )}
        </div>
      </div>

     
    </div>
  );
}
