import { Navbar } from "flowbite-react";
import { useSelector } from "react-redux";
import Logo from "./widgets/Logo";
import SearchBar from "./widgets/SearchBar";
import ThemeToggleButton from "./widgets/ThemeToggleButton";
import UserDropdown from "./widgets/UserDropdown";
import AuthButton from "./widgets/AuthButton";
import NavLinks from "./widgets/NavLinks";

export default function Header() {
  const userData = useSelector((state) => state.user.currentUser);

  const currentUser = userData?.rest || userData;

  return (
    <Navbar className="border-b-2">
      <Logo />
      <SearchBar />
      <div className="flex gap-2 md:order-2">
        <ThemeToggleButton />
        {currentUser ? (
          <UserDropdown currentUser={currentUser} />
        ) : (
          <AuthButton />
        )}
        <Navbar.Toggle />
      </div>
      <NavLinks />
    </Navbar>
  );
}