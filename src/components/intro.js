import React from "react";
import { useStateValue } from "../state";
import Button from "./button";
import Fade from "./fade";

export default function Intro() {
  const [{ hasLoaded, start }, dispatch] = useStateValue();

  return (
    <Fade className="intro" show={!start}>
      <h1>Sustainable Development Report 2024</h1>
      <Fade show={hasLoaded}>
        <Button label="Explore" onClick={() => dispatch({ type: "START" })} />
      </Fade>
    </Fade>
  );
}
