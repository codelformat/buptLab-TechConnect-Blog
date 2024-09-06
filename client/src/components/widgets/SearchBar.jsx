import { TextInput } from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function SearchBar() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    // 从本地存储中获取最近的搜索记录
    const storedSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(storedSearches);
  }, []);

  const handleSubmit = (term = searchTerm) => {
    // 更新搜索记录
    const updatedSearches = [term, ...recentSearches.filter(t => t !== term)];
    if (updatedSearches.length > 3) {
      updatedSearches.pop(); // 保持最多三条记录
    }

    // 保存到本地存储
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    setRecentSearches(updatedSearches);

    // 进行搜索跳转
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", term);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleSearchClick = (term) => {
    setSearchTerm(term);
    setIsHovered(false);
    handleSubmit(term);
  };

  const handleKeyDown = (e) => {
    if (recentSearches.length > 0) {
      if (e.key === "ArrowDown") {
        setSelectedIndex((prevIndex) =>
          prevIndex < recentSearches.length - 1 ? prevIndex + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        setSelectedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : recentSearches.length - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSearchClick(recentSearches[selectedIndex]);
        } else {
          handleSubmit();
        }
      }
    }
  };

  useEffect(() => {
    if (selectedIndex >= 0 && selectedIndex < recentSearches.length) {
      setSearchTerm(recentSearches[selectedIndex]);
    }
  }, [selectedIndex]);

  return (
    <div
      className="relative mb-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className={`flex items-center transition-all duration-300 ease-in-out ${
          isHovered ? "w-64" : "w-12"
        }`}
      >
        <TextInput
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          rightIcon={AiOutlineSearch}
          className={`transition-all duration-300 ease-in-out ${
            isHovered ? "opacity-100 w-full" : "opacity-0 w-0"
          }`}
        />
        <button
          type="button"
          onClick={() => handleSubmit()}
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${
            isHovered
              ? "opacity-0 invisible transition-all"
              : "bg-transparent p-0 w-12 h-12 rounded-full"
          }`}
        >
          <AiOutlineSearch
            className={`text-gray-500 transition-all duration-300 ease-in-out ${
              isHovered ? "text-lg" : "text-2xl"
            }`}
          />
        </button>
      </form>

      {isHovered && recentSearches.length > 0 && (
        <ul className="absolute top-full left-0 bg-white dark:bg-gray-800 shadow-lg rounded-md w-64 mt-2">
          {recentSearches.map((term, index) => (
            <li
              key={index}
              className={`p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${
                selectedIndex === index ? "bg-gray-300 dark:bg-gray-700" : ""
              }`}
              onClick={() => handleSearchClick(term)}
            >
              {term}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}