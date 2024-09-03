import { Footer } from "flowbite-react";

export default function FooterLinksGroup({ title, links }) {
  return (
    <div className="w-48">
      <Footer.Title title={title} />
      <Footer.LinkGroup col>
        {links.map((link, index) => (
          <Footer.Link
            key={index}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.label}
          </Footer.Link>
        ))}
      </Footer.LinkGroup>
    </div>
  );
}