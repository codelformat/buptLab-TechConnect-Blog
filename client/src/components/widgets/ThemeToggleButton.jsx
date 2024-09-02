import { useSelector, useDispatch } from "react-redux";
import { Button } from "flowbite-react";
import { FaMoon, FaSun } from "react-icons/fa";
import { toggleTheme } from "../../redux/theme/themeSlice";

export default function ThemeToggleButton() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);

  return (
    <Button
      className="w-12 h-10 hidden sm:inline"
      color="gray"
      pill
      onClick={() => dispatch(toggleTheme())}
    >
      {theme === "light" ? <FaSun /> : <FaMoon />}
    </Button>
  );
}