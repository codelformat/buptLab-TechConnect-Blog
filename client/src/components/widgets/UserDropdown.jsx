import { Dropdown, Avatar } from "flowbite-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signoutSuccess } from "../../redux/user/userSlice";

export default function UserDropdown({ currentUser }) {
  const dispatch = useDispatch();

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
      label={<Avatar alt="user" img={currentUser.profilePicture} rounded />}
    >
      <Dropdown.Header>
        <span className="block text-sm">@{currentUser.username}</span>
        <span className="block text-sm font-medium truncate">
          @{currentUser.email}
        </span>
      </Dropdown.Header>
      <Link to={"/dashboard?tab=profile"}>
        <Dropdown.Item>Profile</Dropdown.Item>
      </Link>
      <Dropdown.Divider />
      <Dropdown.Item onClick={handleSignout}>Sign Out</Dropdown.Item>
    </Dropdown>
  );
}