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
      href: "https://github.com/codelformat",
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
      <div className="w-full max-w-screen-2xl mx-auto">
        <div className="flex justify-between items-start">
          <FooterLogo />

          <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
            <FooterLinksGroup title="关于" links={aboutLinks} />
            <FooterLinksGroup title="关注我们" links={followUsLinks} />
            <FooterLinksGroup title="法律条款" links={legalLinks} />
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
