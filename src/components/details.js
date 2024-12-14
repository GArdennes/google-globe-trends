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

// export function getRandomMarker({ focusedMarker, markers }) {
//   if (!markers || markers.length === 0) {
//     return null;
//   }

//   // Filter out the focused marker from the list of markers
//   const availableMarkers = markers.filter((marker) => marker !== focusedMarker);

//   // If there are no available markers, return null
//   if (availableMarkers.length === 0) {
//     return null;
//   }

//   // Select a random marker from the available markers
//   const randomIndex = Math.floor(Math.random() * availableMarkers.length);
//   return availableMarkers[randomIndex];
// }

export default function Details() {
  const [{ focusedMarker }, dispatch] = useStateValue();
  // const randomMarker = getRandomMarker({ focusedMarker, markers });

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
          {/* <Button
            label="Random City"
            onClick={() => dispatch({ type: "FOCUS", payload: randomMarker })}
          /> */}
        </div>
        <div
          className="content"
          style={{
            display: "flex",
            flexDirection: "column", // Arrange items vertically
            alignItems: "center", // Center items horizontally
            justifyContent: "center", // Center items vertically
            textAlign: "center",
            fontFamily: "Arial, sans-serif",
            maxWidth: "25vw",
            position: "absolute",
            top: "50%",
            right: "10%",
            transform: "translate(0, -50%)",
          }}>
          <h1
            style={{
              fontSize: "2rem",
              marginBottom: "0rem",
            }}>{`${countryName}`}</h1>
          <p
            style={{
              marginBlockEnd: "0rem",
            }}>
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
  }

  return (
    <Fade className="details" show={focusedMarker}>
      {content}
    </Fade>
  );
}
