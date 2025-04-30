import React from "react";

import Button from "./button.js";
import Fade from "./fade.js";
import Link from "./link.js";

export default function About({ onHide, show }) {
  return (
    <Fade className="about" show={show}>
      <div className="about-content">
        <h2 style={{ color: "white" }}>About</h2>
        <p style={{ color: "white" }}>
          I designed and built <Link link="GITHUB_REPO">SDG Stats Link</Link>, a
          fully client-rendered <Link link="JAMSTACK">JAMstack</Link> platform
          that visualizes UN Sustainable Development Goals data using immersive
          3D globes. It integrates live data from the{" "}
          <Link link="SDG_SITE">2024 UN SDG Report</Link> and leverages{" "}
          <Link link="REACT_GLOBE_GITHUB">react-globe.gl</Link> for
          high-performance WebGL rendering.
        </p>
        <p style={{ color: "white" }}>
          Unlike traditional dashboards, this project offers geospatial
          storytelling inspired by{" "}
          <Link link="GOOGLE_TRENDS">Google Globe Trends</Link>. I extended the
          core rendering engine, built custom layers for SDG-specific overlays,
          and architected the system to run entirely serverless—scalable,
          cache-optimized, and frictionless to deploy.
        </p>

        <Button label="Back" onClick={onHide} />
      </div>
    </Fade>
  );
}
