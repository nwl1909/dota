import React from "react";
import constants from "../constants";

const PageLinks = () => {
  const links: { name: string; path: string }[] = [];
  return (
    <>
      {links.map((link) => (
        <a
          href={link.path}
          key={link.path}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: constants.fontFamilyFuturistic,
            fontSize: constants.fontSizeSmall,
          }}
        >
          {link.name}
        </a>
      ))}
    </>
  );
};

export default PageLinks;
