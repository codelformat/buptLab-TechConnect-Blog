import { TextInput } from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SearchBar() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <div
      className="relative mb-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <form
        onSubmit={handleSubmit}
        className={`flex items-center transition-all duration-300 ease-in-out ${
          isHovered ? "w-64" : "w-12"
        }`}
      >
        <TextInput
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          rightIcon={AiOutlineSearch}
          className={`transition-all duration-300 ease-in-out ${
            isHovered ? "opacity-100 w-full" : "opacity-0 w-0"
          }`}
        />
        <button
          type="submit"
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
    </div>
  );
}