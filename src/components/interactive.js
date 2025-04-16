import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useStateValue } from "../state";
import Fade from "./fade";
import Button from "./button";

export default function Interactive({ show, onHide }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerLayerRef = useRef(null);
  const [{ markers }, dispatch] = useStateValue();
  const [updatedMarkers, setUpdatedMarkers] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // SDG Goals array for filter tray
  const sdgGoals = Array.from({ length: 17 }, (_, i) => i + 1);

  useEffect(() => {
    if (show) {
      dispatch({ type: "TOGGLE_INTERACTIVE", payload: true });
    }
    return () => {
      if (show) {
        dispatch({ type: "TOGGLE_INTERACTIVE", payload: false });
      }
    };
  }, [show, dispatch]);

  useEffect(() => {
    fetch(`../data/populatedmap.geojson`)
      .then((res) => res.json())
      .then(({ features }) => {
        const places = features.filter(
          (feature) => feature.properties.featurecla === "Admin-0 capital",
        );
        const newUpdatedMarkers = markers.map((marker) => {
          const place = places.find(
            (place) => place.properties.adm0_a3 === marker.ISO,
          );
          if (place) {
            return {
              ...marker,
              lat: place.properties.latitude,
              lng: place.properties.longitude,
            };
          }
          return marker;
        });
        setUpdatedMarkers(newUpdatedMarkers);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [markers]);

  // Function to get color based on performance rating
  const getColorForRating = (rating) => {
    if (!rating) return "#808080"; // Gray for no data
    switch (rating.toLowerCase()) {
      case "green":
        return "#4CAF50";
      case "yellow":
        return "#FFEB3B";
      case "red":
        return "#F44336";
      case "orange":
        return "#F44336";
      default:
        return "#808080"; // Gray for unknown
    }
  };

  // Function to get color based on score
  const getColorForScore = (score) => {
    if (score === undefined || score === null) return "#808080"; // Gray for no data
    if (score >= 75) return "#4CAF50"; // Green
    if (score >= 50) return "#FFEB3B"; // Yellow
    return "#F44336"; // Red
  };

  // Get marker color based on selected goal or overall performance
  const getMarkerColor = (marker) => {
    if (selectedGoal) {
      const ratingKey = `Goal ${selectedGoal} Rating`;
      const scoreKey = `Goal ${selectedGoal} Score`;

      if (marker.performance[ratingKey]) {
        return getColorForRating(marker.performance[ratingKey]);
      } else if (marker.performance[scoreKey]) {
        return getColorForScore(marker.performance[scoreKey]);
      }
    }

    // Default: average of all goals
    const scores = Object.entries(marker.performance)
      .filter(([key]) => key.includes("Score"))
      .map(([, score]) => score);

    if (scores.length === 0) return "#808080";

    const avgScore =
      scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return getColorForScore(avgScore);
  };

  // Update map markers when selected goal changes
  useEffect(() => {
    if (mapInstance.current && markerLayerRef.current) {
      mapInstance.current.removeLayer(markerLayerRef.current);

      markerLayerRef.current = L.layerGroup().addTo(mapInstance.current);

      updatedMarkers.forEach((marker) => {
        if (marker.lat && marker.lng) {
          const markerColor = getMarkerColor(marker);

          const markerIcon = L.divIcon({
            className: "custom-marker",
            html: `<div style="background-color: ${markerColor}; width: 10px; height: 10px; border-radius: 50%; border: 1px solid #fff;"></div>`,
            iconSize: [12, 12],
          });

          L.marker([marker.lat, marker.lng], { icon: markerIcon })
            .addTo(markerLayerRef.current)
            .bindPopup(createPopupContent(marker))
            .on("click", () => setSelectedCountry(marker));
        }
      });
    }
  }, [selectedGoal, updatedMarkers, mapInstance.current]);

  // Initialize map
  useEffect(() => {
    if (show && mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([20, 0], 2);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapInstance.current);

      // Create a layer group for markers
      markerLayerRef.current = L.layerGroup().addTo(mapInstance.current);

      // Add legend to map
      addLegendToMap();
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        markerLayerRef.current = null;
      }
    };
  }, [show]);

  // Add legend to map
  const addLegendToMap = () => {
    if (!mapInstance.current) return;

    const legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "legend");
      div.innerHTML = `
        <h4>SDG Performance</h4>
        <div><i style="background: #4CAF50"></i> Good (≥75)</div>
        <div><i style="background: #FFEB3B"></i> Moderate (50-74)</div>
        <div><i style="background: #F44336"></i> Needs Improvement (<50)</div>
        <div><i style="background: #808080"></i> No Data</div>
      `;
      return div;
    };

    legend.addTo(mapInstance.current);

    // Add CSS for legend
    const style = document.createElement("style");
    style.innerHTML = `
      .legend {
        background: white;
        padding: 10px;
        border-radius: 5px;
        box-shadow: 0 0 15px rgba(0,0,0,0.2);
      }
      .legend h4 {
        margin: 0 0 10px;
        font-size: 16px;
      }
      .legend i {
        width: 18px;
        height: 18px;
        float: left;
        margin-right: 8px;
        opacity: 0.7;
        border-radius: 3px;
      }
      .legend div {
        margin-bottom: 5px;
        clear: both;
      }
    `;
    document.head.appendChild(style);
  };

  // Create popup content
  const createPopupContent = (marker) => {
    let content = `
      <div class="popup-content">
        <h3>${marker.country}</h3>
        <p>Population: ${marker.population.toLocaleString()}</p>
    `;

    if (selectedGoal) {
      const ratingKey = `Goal ${selectedGoal} Rating`;
      const scoreKey = `Goal ${selectedGoal} Score`;

      content += `<p>Goal ${selectedGoal}: `;

      if (marker.performance[scoreKey]) {
        content += `Score ${marker.performance[scoreKey]}`;
      } else if (marker.performance[ratingKey]) {
        content += `${marker.performance[ratingKey]}`;
      } else {
        content += `No data`;
      }

      content += `</p>`;
    }

    content += `</div>`;
    return content;
  };

  // Resize map when component becomes visible
  useEffect(() => {
    if (show && mapInstance.current) {
      setTimeout(() => {
        mapInstance.current.invalidateSize();
      }, 100);
    }
  }, [show]);

  // Render SDG goal filter tray
  const renderSdgFilterTray = () => {
    return (
      <div className="sdg-filter-tray">
        <h3>SDG Goals</h3>
        <div className="sdg-icons">
          {sdgGoals.map((goal) => (
            <div
              key={goal}
              className={`sdg-icon ${selectedGoal === goal ? "selected" : ""}`}
              onClick={() =>
                setSelectedGoal(selectedGoal === goal ? null : goal)
              }>
              {goal}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render country details panel
  const renderCountryDetails = () => {
    if (!selectedCountry) return null;

    return (
      <div className="country-details-panel">
        <h2>{selectedCountry.country}</h2>
        <p>Population: {selectedCountry.population.toLocaleString()}</p>
        <p>SDG Rank: {selectedCountry.rank}</p>

        <h3>SDG Goal Performance</h3>
        <div className="sdg-performance-grid">
          {sdgGoals.map((goal) => {
            const ratingKey = `Goal ${goal} Rating`;
            const scoreKey = `Goal ${goal} Score`;
            const rating = selectedCountry.performance[ratingKey];
            const score = selectedCountry.performance[scoreKey];

            return (
              <div key={goal} className="sdg-performance-item">
                <span className="sdg-goal-number">{goal}</span>
                <span
                  className="sdg-goal-indicator"
                  style={{
                    backgroundColor: rating
                      ? getColorForRating(rating)
                      : getColorForScore(score),
                  }}></span>
                <span className="sdg-goal-value">
                  {score ? score.toFixed(1) : rating || "N/A"}
                </span>
              </div>
            );
          })}
        </div>

        <Button onClick={() => setSelectedCountry(null)}>Close</Button>
      </div>
    );
  };

  if (!show) return null;

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossOrigin=""></script>
      <style>
        {`
          .sdg-filter-tray {
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 0 15px rgba(0,0,0,0.2);
            z-index: 1000;
          }
          
          .sdg-filter-tray h3 {
            margin: 0 0 10px;
            text-align: center;
          }
          
          .sdg-icons {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 5px;
          }
          
          .sdg-icon {
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f0f0f0;
            border-radius: 50%;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.2s;
          }
          
          .sdg-icon:hover {
            background: #e0e0e0;
          }
          
          .sdg-icon.selected {
            background: #2196F3;
            color: white;
          }
          
          .country-details-panel {
            position: absolute;
            top: 10px;
            right: 10px;
            background: white;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 0 15px rgba(0,0,0,0.2);
            max-width: 300px;
            max-height: 80vh;
            overflow-y: auto;
            z-index: 1000;
          }
          
          .sdg-performance-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-top: 10px;
          }
          
          .sdg-performance-item {
            display: flex;
            align-items: center;
            gap: 5px;
          }
          
          .sdg-goal-number {
            font-weight: bold;
            width: 20px;
          }
          
          .sdg-goal-indicator {
            width: 15px;
            height: 15px;
            border-radius: 50%;
          }
        `}
      </style>
      <Fade className="interactive-overlay" show={show}>
        <div className="interactive-content">
          <Button
            onClick={onHide}
            className="close-button"
            style={{ margin: "1rem", position: "absolute", top: 0, right: 0 }}>
            Close
          </Button>
          {renderSdgFilterTray()}
          <div
            id="map"
            ref={mapRef}
            style={{ height: "calc(100vh - 60px)", width: "100%" }}
          />
          {renderCountryDetails()}
        </div>
      </Fade>
    </>
  );
}
