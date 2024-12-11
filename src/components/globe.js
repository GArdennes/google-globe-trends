import React, { useEffect, useState } from "react";
import Globe from "react-globe.gl";
import { useStateValue } from "../state";
import Fade from "./fade";

export default function World() {
  const [places, setPlaces] = useState([]);
  const [{ config, focusedMarker, hasLoaded, markers, start }, dispatch] =
    useStateValue();

  useEffect(() => {
    // load data
    fetch(`../data/populatedmap.geojson`)
      .then((res) => res.json())
      .then(({ features }) => setPlaces(features))
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

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
          labelSize={(d) => Math.sqrt(d.properties.pop_max) * 4e-4}
          labelDotRadius={(d) => Math.sqrt(d.properties.pop_max) * 4e-4}
          labelColor={() => "rgba(255, 165, 0, 0.75)"}
          labelResolution={2}
        />
      </div>
      <Fade animationDuration={3000} className="cover" show={!hasLoaded} />
    </>
  );
}
