import { Navbar } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";

export default function NavLinks() {
  const path = useLocation().pathname;

  return (
    <Navbar.Collapse>
      <Navbar.Link active={path === "/"} as={"div"}>
        <Link to="/">首页</Link>
      </Navbar.Link>
      <Navbar.Link active={path === "/about"} as={"div"}>
        <Link to="/about">关于</Link>
      </Navbar.Link>
      <Navbar.Link active={path === "/projects"} as={"div"}>
        <Link to="/posts">帖子</Link>
      </Navbar.Link>
    </Navbar.Collapse>
  );
}