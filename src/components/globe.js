import React, { useEffect, useState } from "react";
import Globe from "react-globe.gl";
import { useStateValue } from "../state";
import Fade from "./fade";

export default function World() {
  const [places, setPlaces] = useState([]);
  const [{ hasLoaded, markers, showInteractive }, dispatch] = useStateValue();

  useEffect(() => {
    // load data
    fetch(`../data/populatedmap.geojson`)
      .then((res) => res.json())
      .then(({ features }) =>
        setPlaces(
          features.filter(
            (feature) => feature.properties.featurecla === "Admin-0 capital",
          ),
        ),
      )
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    if (places && markers) {
      dispatch({ type: "LOADED" });
    }
  }, []);

  if (showInteractive) {
    return null;
  }

  return (
    <>
      <div className={hasLoaded ? undefined : "hidden"}>
        <Globe
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          labelsData={places}
          labelLat={(d) => d.properties.latitude}
          labelLng={(d) => d.properties.longitude}
          labelText={(d) => d.properties.name}
          labelSize={() => 0.5}
          labelDotRadius={() => 0.5}
          labelColor={(d) =>
            markers.find(
              (m) => m.ISO === d.properties.adm0_a3 && m.rank !== "No data",
            )
              ? "rgba(255, 165, 0, 0.75)"
              : "rgba(255, 0, 0, 0.75)"
          }
          labelResolution={2}
          onLabelClick={(d) => {
            const marker = markers.find((m) => m.ISO === d.properties.adm0_a3);
            dispatch({ type: "FOCUS", payload: marker });
          }}
        />
      </div>
      <Fade animationDuration={3000} className="cover" show={!hasLoaded} />
    </>
  );
}
