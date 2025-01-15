import React, { useEffect, useMemo } from "react";
import { useStateValue } from "../state";
import Button from "./button";
import Fade from "./fade";

const getSearchUrl = (country) => {
  return `https://en.wikipedia.org/wiki/${country}`;
};

const getChart = (performance) => {
  const title = Object.keys(performance);
  const data = Object.values(performance);
  const colorArray = data.slice(0, 17);

  for (let i = 0; i < title.length; i++) {
    if (title[i] === "Goal 1 Rating") {
      title[i] = "SDG 1";
    } else if (title[i] === "Goal 2 Rating") {
      title[i] = "SDG 2";
    } else if (title[i] === "Goal 3 Rating") {
      title[i] = "SDG 3";
    } else if (title[i] === "Goal 4 Rating") {
      title[i] = "SDG 4";
    } else if (title[i] === "Goal 5 Rating") {
      title[i] = "SDG 5";
    } else if (title[i] === "Goal 6 Rating") {
      title[i] = "SDG 6";
    } else if (title[i] === "Goal 7 Rating") {
      title[i] = "SDG 7";
    } else if (title[i] === "Goal 8 Rating") {
      title[i] = "SDG 8";
    } else if (title[i] === "Goal 9 Rating") {
      title[i] = "SDG 9";
    } else if (title[i] === "Goal 10 Rating") {
      title[i] = "SDG 10";
    } else if (title[i] === "Goal 11 Rating") {
      title[i] = "SDG 11";
    } else if (title[i] === "Goal 12 Rating") {
      title[i] = "SDG 12";
    } else if (title[i] === "Goal 13 Rating") {
      title[i] = "SDG 13";
    } else if (title[i] === "Goal 14 Rating") {
      title[i] = "SDG 14";
    } else if (title[i] === "Goal 15 Rating") {
      title[i] = "SDG 15";
    } else if (title[i] === "Goal 16 Rating") {
      title[i] = "SDG 16";
    } else if (title[i] === "Goal 17 Rating") {
      title[i] = "SDG 17";
    }
  }

  const dt = {
    datasets: [
      {
        label: "Sustainable Development Goals",
        tree: Array.from(data.slice(17, 34)),
        backgroundColor: (ctx) => colorFromRaw(ctx),
        borderColor: ["rgba(255, 26, 104, 1)"],
        borderWidth: 0,
        spacing: 1,
        labels: {
          display: true,
          overflow: "fit",
          formatter: (ctx) => {
            if (data[ctx.dataIndex] === "null") {
              return `${title[ctx.dataIndex]} - No data`;
            } else if (data[ctx.dataIndex] === "green") {
              return `${title[ctx.dataIndex]} - SDG achieved`;
            } else if (data[ctx.dataIndex] === "yellow") {
              return `${title[ctx.dataIndex]} - Challenges remain`;
            } else if (data[ctx.dataIndex] === "orange") {
              return `${title[ctx.dataIndex]} - Significant challenges remain`;
            } else if (data[ctx.dataIndex] === "red") {
              return `${title[ctx.dataIndex]} - Major challenges remain`;
            }
          },
          font: {
            size: 13,
          },
          color: "black",
        },
        captions: {
          display: false,
          formatter: (ctx) => {
            return title[ctx.dataIndex];
          },
        },
      },
    ],
  };

  const config = {
    type: "treemap",
    data: dt,
    options: {
      plugins: {
        title: {
          display: true,
          text: "Sustainable Development Goals",
        },
        legend: {
          display: false,
        },
      },
    },
  };

  const chartElement = document.getElementById("myChart");
  if (chartElement) {
    const myChart = new Chart(chartElement, config);
    return myChart;
  } else {
    console.error('Element with ID "myChart" not found in the DOM.');
    return null;
  }

  function colorFromRaw(ctx) {
    if (ctx.type !== "data") {
      return "transparent";
    }

    console.log(`ctx: ${ctx.dataIndex}`);
    return `${colorArray[ctx.dataIndex]}`;
  }
};

export default function Details() {
  const [{ focusedMarker }, dispatch] = useStateValue();

  useEffect(() => {
    if (focusedMarker) {
      // Ensure Chart.js is loaded
      const script1 = document.createElement("script");
      script1.src =
        "https://cdn.jsdelivr.net/npm/chart.js/dist/chart.umd.min.js";
      script1.onload = () => {
        const script2 = document.createElement("script");
        script2.src =
          "https://cdn.jsdelivr.net/npm/chartjs-chart-treemap@3.1.0/dist/chartjs-chart-treemap.min.js";
        script2.onload = () => {
          getChart(focusedMarker.performance);
        };
        document.head.appendChild(script2);
      };
      document.head.appendChild(script1);
    }
  }, [focusedMarker]);

  const content = useMemo(() => {
    if (!focusedMarker) return null;

    const countryName = focusedMarker.country;
    const value = focusedMarker.population;
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
          <p className="traffic-info">{`(Population of ${value})`}</p>
          <canvas
            id="myChart"
            width="800"
            height="800"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              margin: "auto",
              maxWidth: "800px",
              padding: "10pt",
            }}></canvas>
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
