import React, { useState } from "react";

import { useStateValue } from "../state.js";
import About from "./about.js";
import Interactive from "./interactive.js";
import Description from "./description.js";
import Fade from "./fade.js";
import Link from "./link.js";
import Icons from "./icons.js";

export default function Overlay() {
  const [{ focusedMarker, markers, start }] = useStateValue();
  const [showAbout, setShowAbout] = useState(false);
  const [showInteractive, setShowInteractive] = useState(false);

  if (!markers) {
    console.error("No markers found.");
  }

  const showOverlay = start && !showAbout && !showInteractive && !focusedMarker;

  return (
    <>
      <Interactive
        onHide={() => setShowInteractive(false)}
        show={showInteractive}
      />
      <About onHide={() => setShowAbout(false)} show={showAbout} />
      <Fade className="overlay" show={showOverlay}>
        <div className="header">
          <div>
            <h1>Global view of SDG performance</h1>
            <div className="overlay-subtitle">
              <Description />
            </div>
          </div>
          <div>
            <Link
              className={"nudge-right"}
              onClick={() => setShowInteractive(true)}>
              Interactive
            </Link>
            <Link className="nudge-right" onClick={() => setShowAbout(true)}>
              About
            </Link>
            <Link link="GITHUB_REPO">Github</Link>
          </div>
        </div>
        <div className="footer">
          <h4 style={{ color: "white" }}>Sustainable Development Goals</h4>
          <div style={{ display: "flex", marginRight: "5rem" }}>
            <Icons />
          </div>
        </div>
      </Fade>
    </>
  );
}
