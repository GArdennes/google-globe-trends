import moment from "moment";
import React, { useState } from "react";

import { useStateValue } from "../state";
import About from "./about";
import Description from "./description";
import Fade from "./fade";
import Link from "./link";

export default function Overlay() {
  const [{ focusedMarker, lastUpdated, markers, start }] = useStateValue();
  const [showAbout, setShowAbout] = useState(false);

  if (!markers) {
    console.error("No markers found.");
  }

  const showOverlay = start && !showAbout && !focusedMarker;

  return (
    <>
      <About onHide={() => setShowAbout(false)} show={showAbout} />
      <Fade className="overlay" show={showOverlay}>
        <div className="header">
          <div>
            <h2>Google Globe Trends</h2>
            <div className="overlay-subtitle">
              <Description />
            </div>
          </div>
          <div>
            <Link className="nudge-right" onClick={() => setShowAbout(true)}>
              About
            </Link>
            <Link link="GITHUB_REPO">Github</Link>
          </div>
        </div>
        <div className="footer">
          Updated on {moment(lastUpdated).format("MMM D, YYYY")}
        </div>
      </Fade>
    </>
  );
}
