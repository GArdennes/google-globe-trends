import React, { Suspense, lazy } from "react";
import ErrorBoundary from "../components/ErrorBoundary";

const Details = lazy(() => import("../components/details"));
const World = lazy(() => import("../components/globe"));
const Intro = lazy(() => import("../components/intro"));
const Overlay = lazy(() => import("../components/overlay"));

export default function GlobePage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <World />
        <Intro />
        <Overlay />
        <Details />
      </Suspense>
    </ErrorBoundary>
  );
}