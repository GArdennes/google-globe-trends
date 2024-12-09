import React from "react";

import Details from "./details";
import World from "./globe";
import Intro from "./intro";
import Overlay from "./overlay";

export default function App() {
  return (
    <>
      <World />
      <Intro />
      <Overlay />
      <Details />
    </>
  );
}
