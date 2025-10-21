import React, { Suspense, lazy } from "react";

const Details = lazy(() => import("../components/details"));
const World = lazy(() => import("../components/globe"));
const Intro = lazy(() => import("../components/intro"));
const Overlay = lazy(() => import("../components/overlay"));

export default function GlobePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <World />
      <Intro />
      <Overlay />
      <Details />
    </Suspense>
  );
}