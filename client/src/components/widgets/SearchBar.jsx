import { TextInput, Button } from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";

export default function SearchBar() {
  return (
    <>
      <form>
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