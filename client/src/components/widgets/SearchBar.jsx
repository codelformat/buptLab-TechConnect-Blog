import { TextInput, Button } from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate} from 'react-router-dom';
import {useState} from 'react'

export default function SearchBar() {
  const navigate =useNavigate();
  const [searchTerm,setSearchTerm] =useState('');
  const handleSubmit =(e) =>{
    e.preventDefault();
    const urlParams = new URLSearchParams(Location.serch);
    urlParams.set('searchTerm',searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>
    </>
  );
}