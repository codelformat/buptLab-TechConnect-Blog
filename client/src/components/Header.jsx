// /client/src/components/Header.jsx
import { Navbar } from "flowbite-react";
import { useSelector } from "react-redux";
import Logo from "./widgets/Logo";
import SearchBar from "./widgets/SearchBar";
import ThemeToggleButton from "./widgets/ThemeToggleButton";
import UserDropdown from "./widgets/UserDropdown";
import AuthButton from "./widgets/AuthButton";
import NavLinks from "./widgets/NavLinks";
import { useLocation } from "react-router-dom";
import ".././pages/SignIn.css";
import { useEffect, useState } from "react";

export default function Header() {
  const userData = useSelector((state) => state.user.currentUser);
  const { theme } = useSelector((state) => state.theme);
  const location = useLocation();
  const isSignInPage = location.pathname === "/sign-in";
  const isSignUpPage = location.pathname === "/sign-up";
  const isForgotPage = location.pathname === "/forgot-password";
  const isResetPage = location.pathname === "/reset-password";

  const currentUser = userData?.rest || userData;
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (currentUser) {
      const interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/notifications/${currentUser._id}`);
          const notifications = await res.json();
          console.log(notifications);
          const unread = notifications.filter((n) => !n.isRead).length;
          setUnreadCount(unread);
        } catch (error) {
          console.error('Failed to fetch unread notifications count', error);
        }
      }, 5000); // Poll every 5 seconds
  
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  return (
    <Navbar
      className={` ${
        isSignInPage || isSignUpPage || isForgotPage || isResetPage
          ? (theme === 'dark' ? "dynamic-bg-dark" : "dynamic-bg")
          : ".default-bg"
      }`}
    >
      <Logo />
      <SearchBar />
      <div className="flex gap-2 md:order-2">
        <ThemeToggleButton />
        {currentUser ? (
          <UserDropdown currentUser={currentUser} unreadCount={unreadCount} setUnreadCount={setUnreadCount} />
        ) : (
          <AuthButton />
        )}
        <Navbar.Toggle />
      </div>
      <NavLinks />
    </Navbar>
  );
}
