import { Footer } from "flowbite-react";

export default function FooterCopyright() {
  return (
    <Footer.Copyright
      href="#"
      by="Codelformat's Blog"
      year={new Date().getFullYear()}
    />
  );
}