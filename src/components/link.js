import React from "react";

const links = {
  CONFIG:
    "https://github.com/GArdennes/google-globe-trends/blob/main/src/config.js",
  GITHUB_REPO: "https://github.com/GArdennes/google-globe-trends",
  GOOGLE_TRENDS_API: "https://www.npmjs.com/package/google-trends-api",
  JAMSTACK: "https://jamstack.org/",
  METOO: "https://metoorising.withgoogle.com/",
  REACT_GLOBE_GITHUB: "https://github.com/vasturiano/react-globe.gl",
  GOOGLE_TRENDS: "https://github.com/chrisrzhou/google-globe-trends",
};

export default function Link({ children, className, link, onClick }) {
  const hasLink = links[link] && !onClick;
  return (
    <a
      className={className}
      href={hasLink ? links[link] : "#"}
      rel={hasLink ? "noopener noreferrer" : undefined}
      target={hasLink ? "_blank" : undefined}
      onClick={onClick}>
      {children}
    </a>
  );
}
