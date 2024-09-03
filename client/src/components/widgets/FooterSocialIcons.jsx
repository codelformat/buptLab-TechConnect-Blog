import { Footer } from "flowbite-react";
import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsDribbble } from "react-icons/bs";

export default function FooterSocialIcons() {
  return (
    <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
      <Footer.Icon href="#" icon={BsFacebook} />
      <Footer.Icon href="#" icon={BsInstagram} />
      <Footer.Icon href="#" icon={BsTwitter} />
      <Footer.Icon href="https://github.com/codelformat" icon={BsGithub} />
      <Footer.Icon href="#" icon={BsDribbble} />
    </div>
  );
}