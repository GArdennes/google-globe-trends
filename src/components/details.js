import React from "react";

import { useStateValue } from "../state";
import Button from "./button";
import Fade from "./fade";

function getSearchUrl(country, keyword) {
  const formattedQuery = `${encodeURIComponent(country)} ${encodeURIComponent(
    keyword,
  )}`.replace(/(%20| )/g, "+");
  return `https://www.google.com/search?q=${formattedQuery}`;
}

export function getRandomMarker({ focusedMarker, markers }) {
  if (!markers || markers.length === 0) {
    return null;
  }

  // Filter out the focused marker from the list of markers
  const availableMarkers = markers.filter((marker) => marker !== focusedMarker);

  // If there are no available markers, return null
  if (availableMarkers.length === 0) {
    return null;
  }

  // Select a random marker from the available markers
  const randomIndex = Math.floor(Math.random() * availableMarkers.length);
  return availableMarkers[randomIndex];
}

export default function Details() {
  const [{ focusedMarker, markers }, dispatch] = useStateValue();
  const randomMarker = getRandomMarker({ focusedMarker, markers });

  let content;
  if (focusedMarker) {
    const countryName = focusedMarker.country;
    const value = focusedMarker.traffic;
    const topics = focusedMarker.title;
    const url = getSearchUrl(countryName, topics);

    content = (
      <>
        <div className="header">
          <Button
            label="Back to globe"
            onClick={() => dispatch({ type: "FOCUS" })}
          />
          <Button
            label="Random City"
            onClick={() => dispatch({ type: "FOCUS", payload: randomMarker })}
          />
        </div>
        <div className="content">
          <h1>{`${countryName}`}</h1>
          <div className="details-content">
            <p>{`Trending topic: ${topics} (Approximate traffic of ${value})`}</p>
          </div>
          <Button
            label="View search results"
            onClick={() => window.open(url, "_blank")}
          />
        </div>
      </>
    );
  }

  return (
    <Fade className="details" show={focusedMarker}>
      {content}
    </Fade>
  );
}
