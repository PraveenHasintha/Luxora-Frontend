// Luxora-Frontend/src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./styles/globals.css";
import App from "./app/App.jsx";

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error('Root element not found. Ensure public/index.html contains <div id="root"></div>.');
}

const root = ReactDOM.createRoot(rootEl);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
