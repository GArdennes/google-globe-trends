import React from "react";
import { useStateValue } from "../state";
import Button from "./button";
import Fade from "./fade";

export default function Intro() {
  const [{ start }, dispatch] = useStateValue();

  return (
    <Fade className="intro" show={!start}>
      <h1>Globe Trends</h1>
      {/* <Fade show={hasLoaded}> */}
      <Button label="Explore" onClick={() => dispatch({ type: "START" })} />
      {/* </Fade> */}
    </Fade>
  );
}
