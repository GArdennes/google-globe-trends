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
          <h1
            style={{ fontSize: "2rem", marginBottom: "0rem", color: "white" }}>
            {countryName}
          </h1>
          <p style={{ marginBlockEnd: "0rem", color: "white" }}>
            Trending topic:{" "}
            <a
              className="clickable-link"
              onClick={() => window.open(focusedMarker.link, "_blank")}
              style={{ color: "lightblue" }}>
              {topics}
            </a>
          </p>
          <p
            style={{ color: "white" }}>{`(Approximate traffic of ${value})`}</p>
          <Button
            className="search-button"
            label="View search results"
            onClick={() => window.open(url, "_blank")}
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
