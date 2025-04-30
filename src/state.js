import React, { createContext, useContext, useReducer } from "react";

import config from "./config.js";
import data from "./data/data.json";

const trends = data;

export const initialState = {
  config,
  focusedMarker: null,
  hasLoaded: false,
  markers: trends,
  start: false,
};

export function reducer(state, action) {
  const { payload, type } = action;
  switch (type) {
    case "LOADED":
      return {
        ...state,
        hasLoaded: true,
      };
    case "START":
      return {
        ...state,
        start: true,
      };
    case "FOCUS":
      return {
        ...state,
        focusedMarker: payload,
      };
    case "TOGGLE_INTERACTIVE":
      return {
        ...state,
        showInteractive: action.payload,
      };
    default:
      return state;
  }
}

const StateContext = createContext(null);

export function StateProvider({ children, initialState, reducer }) {
  return (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
      {children}
    </StateContext.Provider>
  );
}

export function useStateValue() {
  return useContext(StateContext);
}
