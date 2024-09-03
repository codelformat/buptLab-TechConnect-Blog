import { Link } from "react-router-dom";
import { Button } from "flowbite-react";

export default function AuthButton() {
  return (
    <Link to="/sign-in">
      <Button gradientDuoTone="purpleToBlue" outline>
        登录
      </Button>
    </Link>
  );
}