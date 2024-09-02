import { Link } from "react-router-dom";
import { Button } from "flowbite-react";

export default function AuthButton() {
  return (
    <Link to="/sign-in">
      <Button gradientDuoTone="purpleToBlue" outline>
        Sign In
      </Button>
    </Link>
  );
}