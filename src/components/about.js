import React from "react";

import Button from "./button";
import Fade from "./fade";
import Link from "./link";

export default function About({ onHide, show }) {
  return (
    <Fade className="about" show={show}>
      <div className="about-content">
        <h2>About</h2>
        <p>
          <Link link="GITHUB_REPO">Globe Trends</Link> is a{" "}
          <Link link="JAMSTACK">JAMstack</Link> application built without any
          server components. Data is fetched during build time using the{" "}
          <Link link="GOOGLE_TRENDS_API">google-trends-api</Link> library. Globe
          visualizations are rendered using the{" "}
          <Link link="REACT_GLOBE_GITHUB">react-globe</Link> component.
        </p>
        <p>
          This project is inspired by the wonderful{" "}
          <Link link="GOOGLE_TRENDS">Google globe trends</Link> project. With
          most of interactive features supported by{" "}
          <Link link="REACT_GLOBE_GITHUB">react-globe.gl</Link>, the project
          aims to simplify building beautiful globe visualizations with Google
          Trends datasets.
        </p>
        <Button label="Back" onClick={onHide} />
      </div>
    </Fade>
  );
}
