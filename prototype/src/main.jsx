import React from "react";
import { createRoot } from "react-dom/client";
import { AppV5 } from "./AppV5.jsx";
import "./styles.css";
import "./fe-v5.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppV5 />
  </React.StrictMode>,
);
