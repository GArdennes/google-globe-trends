import React, { useState } from "react";

import { useStateValue } from "../state";
import About from "./about";
import Interactive from "./interactive";
import Description from "./description";
import Fade from "./fade";
import Link from "./link";
import Icons from "./icons";

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
