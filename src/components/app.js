import React, { Suspense, lazy } from "react";

const Details = lazy(() => import("./details.js"));
const World = lazy(() => import("./globe.js"));
const Intro = lazy(() => import("./intro.js"));
const Overlay = lazy(() => import("./overlay.js"));

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <World />
      <Intro />
      <Overlay />
      <Details />
    </Suspense>
  );
}
