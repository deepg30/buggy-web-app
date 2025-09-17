import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/global.css";

// Bug #1: Trying to access a property that might not exist (wrapped in try-catch)
try {
  console.log(window.someUndefinedProperty.value); // TypeError but won't crash the app
} catch (error) {
  console.error("Bug #1 triggered:", error.message);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
