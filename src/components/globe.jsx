import React, { useEffect, useState, useRef } from "react";
import Globe from "react-globe.gl";
import { useStateValue } from "../state";
import Fade from "./fade";

export default function World() {
  const [{ hasLoaded, markers, start }, dispatch] = useStateValue();
  const [ownMarkers, setOwnMarkers] = useState([]);
  const globeRef = useRef(null); // Create a ref for the Globe component

  const markerSvg = `<svg viewBox="-4 0 36 36">
    <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
    <circle fill="black" cx="14" cy="14" r="7"></circle>
  </svg>`;

  useEffect(() => {
    // Load capital cities data
    fetch(`/data/populatedmap.geojson`)
      .then((res) => res.json())
      .then(({ features }) => {
        const capitalCities = features.filter(
          (feature) => feature.properties.featurecla === "Admin-0 capital",
        );

        const mainCities = capitalCities.filter((city) =>
          markers && Array.isArray(markers) && markers.some((marker) => marker.ISO === city.properties.iso_a2),
        );

        // Generate some example markers
        const exampleMarkers = mainCities.map((city) => ({
          ISO: city.properties.iso_a2,
          name: city.properties.name,
          lat: city.properties.latitude,
          lng: city.properties.longitude,
          size: 20,
          color: ["orange", "red", "blue", "green"][
            Math.round(Math.random() * 3)
          ],
        }));

        setOwnMarkers(exampleMarkers);
        dispatch({
          type: "LOADED",
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // Still dispatch LOADED even if data fetch fails to prevent infinite loading
        dispatch({
          type: "LOADED",
        });
      });
  }, [markers, dispatch]);

  useEffect(() => {
    console.log("Markers state:", markers);
    console.log("Processed markers:", ownMarkers);
  }, [markers, ownMarkers]);

  return (
    <>
      <div className={hasLoaded ? undefined : "hidden"}>
        <Globe
          ref={globeRef} // Attach the ref to the Globe component
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          htmlElementsData={ownMarkers}
          htmlElement={(d) => {
            // Create a container div
            const container = document.createElement("div");
            if (!start) return container;
            container.style.position = "relative";
            container.style.transition = "opacity 250ms";
            container.style.pointerEvents = "auto";
            container.style.cursor = "pointer";

            // Create marker element
            const markerElement = document.createElement("div");
            markerElement.innerHTML = markerSvg;
            markerElement.style.color = d.color;
            markerElement.style.width = `${d.size}px`;

            // Create label element (initially hidden)
            const labelElement = document.createElement("div");
            labelElement.textContent = d.name || d.location || "Unknown";
            labelElement.style.color = "white";
            labelElement.style.background = "rgba(0, 0, 0, 0.7)";
            labelElement.style.padding = "4px 8px";
            labelElement.style.borderRadius = "4px";
            labelElement.style.fontSize = "0.9em";
            labelElement.style.whiteSpace = "nowrap";
            labelElement.style.position = "absolute";
            labelElement.style.left = "50%"; // Center horizontally below the marker
            labelElement.style.top = "100%"; // Position below the marker
            labelElement.style.transform = "translateX(-50%)"; // Center horizontally
            labelElement.style.marginLeft = "10px"; // Space between marker and label
            labelElement.style.opacity = "0"; // Hidden by default
            labelElement.style.transition = "opacity 0.2s";
            labelElement.style.zIndex = "100";

            if (container) {
              container.appendChild(markerElement);
              container.appendChild(labelElement);
            }

            // Show label on hover
            container.onmouseenter = () => {
              labelElement.style.opacity = "1";
            };

            // Hide label when not hovering
            container.onmouseleave = () => {
              labelElement.style.opacity = "0";
            };

            // Set click handler
            container.onclick = () =>
              dispatch({
                type: "FOCUS",
                payload: markers.find((marker) => marker.ISO === d.ISO),
              });

            return container;
          }}
          htmlElementVisibilityModifier={(el, isVisible) => {
            let zoomLevel = 1;

            // Safe access to camera distance (which indicates zoom level)
            if (
              globeRef.current &&
              globeRef.current.scene() &&
              globeRef.current.camera()
            ) {
              const cameraDistance = globeRef.current
                .camera()
                .position.distanceTo(globeRef.current.scene().position);
              // Convert distance to a zoom value (higher distance = lower zoom)
              // Adjust these values based on your globe size
              zoomLevel = 1000 / cameraDistance;
            }

            const minZoomToShowLabels = 7; // Adjust this threshold based on testing

            if (isVisible) {
              // Always show the marker when visible
              el.style.opacity = 1;

              // Show or hide the label based on zoom level
              const labelElement = el.querySelector("div:nth-child(2)");
              if (labelElement) {
                if (zoomLevel >= minZoomToShowLabels) {
                  labelElement.style.opacity = "1";
                } else {
                  labelElement.style.opacity = "0";
                }
              }
            } else {
              // Hide everything when not visible
              el.style.opacity = 0;
            }
          }}
        />
      </div>
      <Fade animationDuration={3000} className="cover" show={!hasLoaded} />
    </>
  );
}
