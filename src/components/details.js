import React, { useMemo } from "react";
import { useStateValue } from "../state";
import Button from "./button";
import Fade from "./fade";

// Create a script element for Chart.js
const chartJsScript = document.createElement("script");
chartJsScript.type = "text/javascript";
chartJsScript.src =
  "https://cdn.jsdelivr.net/npm/chart.js/dist/chart.umd.min.js";
document.head.appendChild(chartJsScript);

// Create a script element for Chart.js Treemap
const chartJsTreemapScript = document.createElement("script");
chartJsTreemapScript.type = "text/javascript";
chartJsTreemapScript.src =
  "https://cdn.jsdelivr.net/npm/chartjs-chart-treemap@3.1.0/dist/chartjs-chart-treemap.min.js";
document.head.appendChild(chartJsTreemapScript);

const getSearchUrl = (country) => {
  const formattedQuery = `${encodeURIComponent(country)}`.replace(
    /(%20| )/g,
    "+",
  );
  return `https://en.wikipedia.org/wiki/${formattedQuery}`;
};

const getChart = (performance) => {
  // const labels = Object.keys(performance);
  const data = Object.values(performance);

  const dt = {
    datasets: [
      {
        label: "Sustainable Development Goals",
        data: data,
        backgroundColor: ["rgba(255, 26, 104, 0.2)"],
        borderColor: ["rgba(255, 26, 104, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const config = {
    type: "treemap",
    data: dt,
    options: {},
  };

  const myChart = new Chart(document.getElementById("myChart"), config);
  return myChart;
};

export default function Details() {
  const [{ focusedMarker }, dispatch] = useStateValue();

  const content = useMemo(() => {
    if (!focusedMarker) return null;

    const countryName = focusedMarker.country;
    const value = focusedMarker.population;
    const topics = focusedMarker.performance;
    const url = getSearchUrl(countryName);

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
          <div className="Sustainable-Development-Goals">
            <canvas id="myChart" width="400" height="400"></canvas>
            {getChart(topics)}
          </div>
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
