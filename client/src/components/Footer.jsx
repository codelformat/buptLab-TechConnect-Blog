import { Footer } from "flowbite-react";
import FooterLogo from "./widgets/Logo";
import FooterLinksGroup from "./widgets/FooterLinksGroup";
import FooterSocialIcons from "./widgets/FooterSocialIcons";
import FooterCopyright from "./widgets/FooterCopyright";

export default function FooterComponent() {
  const aboutLinks = [
    {
      href: "https://www.bupt.edu.cn/",
      label: "Beijing University of Posts and Telecommunications",
    },
    {
      href: "/about",
      label: "Codelformat's Blog",
    },
  ];

  const followUsLinks = [
    {
      href: "https://github.com/codelformat",
      label: "Github",
    },
    {
      href: "#",
      label: "Github",
    },
  ];

  const legalLinks = [
    {
      href: "#",
      label: "Privacy Policy",
    },
    {
      href: "#",
      label: "Terms & Conditions",
    },
  ];

  return (
    <Footer container className="border border-t-8 border-teal-500">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <FooterLogo />
          <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
            <FooterLinksGroup title="About" links={aboutLinks} />
            <FooterLinksGroup title="Follow Us" links={followUsLinks} />
            <FooterLinksGroup title="Legal" links={legalLinks} />
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <FooterCopyright />
          <FooterSocialIcons />
        </div>
      </div>
    </Footer>
  );
}
