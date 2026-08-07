import React from "react";
import { createRoot } from "react-dom/client";
import { AppV5 } from "./AppV5.jsx";
import { resolveFeFilterLayoutVariant } from "./feFilterLayout.js";
import "./styles.css";
import "./fe-v5.css";
import "./fe-filter-variants.css";
import "./fe-result-review.css";
import "./fe-session-enhancements.css";

document.documentElement.dataset.feFilterLayout = resolveFeFilterLayoutVariant(window.location.search);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppV5 />
  </React.StrictMode>,
);
