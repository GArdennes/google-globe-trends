import React from "react";
import { useStateValue } from "../state";
import Fade from "./fade";

export default function CountryComparison() {
  const [{ comparisonCountries, selectedYear }] = useStateValue();

  // Get all SDGs from the first country to use as headers
  const sdgKeys =
    comparisonCountries.length > 0 && comparisonCountries[0].SDG
      ? Object.keys(comparisonCountries[0].SDG).sort()
      : [];

  // Generate colors for each SDG
  const getSDGColor = (sdg) => {
    const colors = {
      "SDG 1": "#e5243b",
      "SDG 2": "#dda63a",
      "SDG 3": "#4c9f38",
      "SDG 4": "#c5192d",
      "SDG 5": "#ff3a21",
      "SDG 6": "#26bde2",
      "SDG 7": "#fcc30b",
      "SDG 8": "#a21942",
      "SDG 9": "#fd6925",
      "SDG 10": "#dd1367",
      "SDG 11": "#fd9d24",
      "SDG 12": "#bf8b2e",
      "SDG 13": "#3f7e44",
      "SDG 14": "#0a97d9",
      "SDG 15": "#56c02b",
      "SDG 16": "#00689d",
      "SDG 17": "#19486a",
    };

    return colors[sdg] || "#888888";
  };

  // Function to get the color intensity based on score
  const getScoreColor = (score) => {
    if (score === undefined || score === null) return "#cccccc";

    // Score range is typically 0-100
    const normalizedScore = Math.min(100, Math.max(0, score)) / 100;
    const r = Math.floor(255 * (1 - normalizedScore));
    const g = Math.floor(200 * normalizedScore);
    const b = 100;

    return `rgb(${r}, ${g}, ${b})`;
  };

  if (!comparisonCountries || comparisonCountries.length === 0) {
    return null;
  }

  return (
    <Fade className="country-comparison" show={true}>
      <div className="comparison-header">
        <h2>Comparing {comparisonCountries.length} Countries</h2>
        <div className="year-indicator">Data for {selectedYear}</div>
      </div>

      <div className="comparison-overview">
        <table className="comparison-table overview-table">
          <thead>
            <tr>
              <th>Country</th>
              <th>Overall Score</th>
              <th>Rank</th>
            </tr>
          </thead>
          <tbody>
            {comparisonCountries.map((country) => (
              <tr key={country.ISO}>
                <td>{country.Country}</td>
                <td>
                  {country.score !== undefined
                    ? country.score.toFixed(1)
                    : "N/A"}
                </td>
                <td>{country.rank !== undefined ? country.rank : "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="comparison-detail">
        <h3>SDG Performance</h3>
        <div className="sdg-heatmap-container">
          <table className="sdg-heatmap">
            <thead>
              <tr>
                <th>Country</th>
                {sdgKeys.map((sdg) => (
                  <th
                    key={sdg}
                    style={{
                      backgroundColor: getSDGColor(sdg),
                      color: "white",
                    }}>
                    {sdg}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonCountries.map((country) => (
                <tr key={country.ISO}>
                  <td>{country.Country}</td>
                  {sdgKeys.map((sdg) => {
                    const score =
                      country.SDG && country.SDG[sdg]
                        ? parseFloat(country.SDG[sdg])
                        : null;

                    return (
                      <td
                        key={`${country.ISO}-${sdg}`}
                        style={{
                          backgroundColor: getScoreColor(score),
                          color: score > 50 ? "black" : "white",
                        }}>
                        {score !== null ? score.toFixed(1) : "N/A"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="comparison-insights">
        <h3>Key Insights</h3>
        <ul>
          {comparisonCountries.map((country) => {
            // Find best and worst SDGs
            const sdgs = country.SDG || {};
            const sdgEntries = Object.entries(sdgs).filter(
              ([_, value]) =>
                value !== undefined &&
                value !== null &&
                !isNaN(parseFloat(value)),
            );

            if (sdgEntries.length === 0) return null;

            const bestSdg = sdgEntries.reduce((best, current) =>
              parseFloat(current[1]) > parseFloat(best[1]) ? current : best,
            );

            const worstSdg = sdgEntries.reduce((worst, current) =>
              parseFloat(current[1]) < parseFloat(worst[1]) ? current : worst,
            );

            return (
              <li key={country.ISO}>
                <strong>{country.Country}</strong>: Best performing in{" "}
                {bestSdg[0]} ({parseFloat(bestSdg[1]).toFixed(1)}), needs
                improvement in {worstSdg[0]} (
                {parseFloat(worstSdg[1]).toFixed(1)})
              </li>
            );
          })}
        </ul>
      </div>
    </Fade>
  );
}
