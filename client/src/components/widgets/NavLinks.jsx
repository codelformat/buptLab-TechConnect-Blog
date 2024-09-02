import { Navbar } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";

export default function NavLinks() {
  const path = useLocation().pathname;

  return (
    <Navbar.Collapse>
      <Navbar.Link active={path === "/"} as={"div"}>
        <Link to="/">Home</Link>
      </Navbar.Link>
      <Navbar.Link active={path === "/about"} as={"div"}>
        <Link to="/about">About</Link>
      </Navbar.Link>
      <Navbar.Link active={path === "/projects"} as={"div"}>
        <Link to="/projects">Projects</Link>
      </Navbar.Link>
    </Navbar.Collapse>
  );
}