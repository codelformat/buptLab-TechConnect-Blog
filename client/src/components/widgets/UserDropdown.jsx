import { Dropdown, Avatar, Badge } from "flowbite-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signoutSuccess } from "../../redux/user/userSlice";
import { useEffect, useState } from "react";

export default function UserDropdown({ currentUser, unreadCount, setUnreadCount }) {
  const dispatch = useDispatch();
  // const [unreadCount, setUnreadCount] = useState(0);

  const handleSignout = async () => {
    try {
      console.log("signout");
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dropdown
      arrIcon={false}
      inline
      label={
        <div className="relative">
          <Avatar alt="user" img={currentUser.profilePicture} rounded />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
          )}
        </div>
      }
    >
      <Dropdown.Header>
        <span className="block text-sm">@{currentUser.username}</span>
        <span className="block text-sm font-medium truncate">
          @{currentUser.email}
        </span>
      </Dropdown.Header>
      <Link to={"/dashboard?tab=profile"}>
        <Dropdown.Item>
          用户资料
          {unreadCount > 0 && (
            <Badge color="red" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </Dropdown.Item>
      </Link>
      <Dropdown.Divider />
      <Dropdown.Item onClick={handleSignout}>登出</Dropdown.Item>
    </Dropdown>
  );
}
