import React from "react";
import { createRoot } from "react-dom/client";

import App from "./components/app";
import { StateProvider, initialState, reducer } from "./state";

import "./index.scss";

function Root() {
  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <App />
    </StateProvider>
  );
}

// New React 18 rendering method
const root = createRoot(document.getElementById("root"));
root.render(<Root />);
