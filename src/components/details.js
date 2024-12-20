import React, { useMemo } from "react";
import { useStateValue } from "../state";
import Button from "./button";
import Fade from "./fade";

const getSearchUrl = (country, keyword) => {
  const formattedQuery = `${encodeURIComponent(country)} ${encodeURIComponent(
    keyword,
  )}`.replace(/(%20| )/g, "+");
  return `https://www.google.com/search?q=${formattedQuery}`;
};

export default function Details() {
  const [{ focusedMarker }, dispatch] = useStateValue();

  const content = useMemo(() => {
    if (!focusedMarker) return null;

    const countryName = focusedMarker.country;
    const value = focusedMarker.traffic;
    const topics = focusedMarker.title;
    const url = getSearchUrl(countryName, topics);

    return (
      <>
        <div className="header">
          <Button
            label="Back to globe"
            onClick={() => dispatch({ type: "FOCUS" })}
          />
        </div>
        <div className="content">
          <h1 style={{ fontSize: "2rem", marginBottom: "0rem" }}>
            {countryName}
          </h1>
          <p style={{ marginBlockEnd: "0rem" }}>
            Trending topic:{" "}
            <a
              className="clickable-link"
              onClick={() => window.open(focusedMarker.link, "_blank")}>
              {topics}
            </a>
          </p>
          <p>{`(Approximate traffic of ${value})`}</p>
          <Button
            label="View search results"
            onClick={() => window.open(url, "_blank")}
            style={{
              backgroundColor: "#333",
              color: "#fff",
              padding: "0.5rem 1rem",
              borderRadius: "5px",
              border: "none",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          />
        </div>
      </>
    );
  }, [focusedMarker, dispatch]);

  return (
    <Fade className="details" show={focusedMarker}>
      {content}
    </Fade>
  );
}
