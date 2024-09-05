import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link
      to="/"
      className="self-center whitespace-nowrap text-2xl 
      sm:text-3xl font-bold dark:text-white flex items-center"
    >
      <span
        className="px-3 py-2 bg-gradient-to-r from-blue-500
            via-teal-400 to-green-500 rounded-lg text-white 
            shadow-lg transform rotate-12 transition-transform duration-300 ease-out
            hover:rotate-0 hover:scale-105 hover:bg-gradient-to-l hover:from-green-500 hover:via-teal-400 hover:to-blue-500"
      >
        Tech
      </span>
      <span className="ml-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l">
        Connect
      </span>
      <span className="ml-2 text-[#00FF00] animate-pulse">•</span>
    </Link>
  );
}