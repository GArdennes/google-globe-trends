import React, { Suspense, lazy } from "react";

const Details = lazy(() => import("./details"));
const World = lazy(() => import("./globe"));
const Intro = lazy(() => import("./intro"));
const Overlay = lazy(() => import("./overlay"));

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
