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

function installFeFilterLayoutMeasurement() {
  const desktopMedia = window.matchMedia("(min-width: 721px)");
  let animationFrame = 0;
  /** @type {HTMLElement | null} */
  let observedGrid = null;
  /** @type {HTMLElement[]} */
  let observedCards = [];

  const resizeObserver = new ResizeObserver(() => scheduleMeasurement());

  /**
   * @param {HTMLElement | null} grid
   * @param {HTMLElement[]} cards
   */
  const observeCurrentLayout = (grid, cards) => {
    const unchanged = observedGrid === grid
      && observedCards.length === cards.length
      && observedCards.every((card, index) => card === cards[index]);
    if (unchanged) return;

    resizeObserver.disconnect();
    observedGrid = grid;
    observedCards = cards;
    if (!grid) return;
    resizeObserver.observe(grid);
    cards.forEach((card) => resizeObserver.observe(card));
  };

  const measure = () => {
    animationFrame = 0;
    const grid = /** @type {HTMLElement | null} */ (document.querySelector(".fe-filter-variant-grid"));
    const cards = /** @type {HTMLElement[]} */ (grid ? [...grid.querySelectorAll(":scope > fieldset")] : []);
    observeCurrentLayout(grid, cards);
    if (!grid) return;

    const layout2Desktop = document.documentElement.dataset.feFilterLayout === "2"
      && desktopMedia.matches
      && cards.length === 4;
    if (!layout2Desktop) {
      grid.style.removeProperty("--fe-filter-layout-2-extra-space");
      grid.dataset.feLayoutMeasured = "true";
      return;
    }

    const rowGap = Number.parseFloat(getComputedStyle(grid).rowGap) || 0;
    const leftStackHeight = cards[0].getBoundingClientRect().height
      + rowGap
      + cards[1].getBoundingClientRect().height;
    const periodHeight = cards[2].getBoundingClientRect().height;
    const extraSpace = Math.max(0, Math.ceil(periodHeight - leftStackHeight));
    const nextValue = `${extraSpace}px`;

    if (grid.style.getPropertyValue("--fe-filter-layout-2-extra-space") !== nextValue) {
      grid.style.setProperty("--fe-filter-layout-2-extra-space", nextValue);
    }
    grid.dataset.feLayoutMeasured = "true";
  };

  function scheduleMeasurement() {
    if (observedGrid) observedGrid.dataset.feLayoutMeasured = "false";
    if (animationFrame) return;
    animationFrame = window.requestAnimationFrame(measure);
  }

  const mutationObserver = new MutationObserver(scheduleMeasurement);
  mutationObserver.observe(document.documentElement, { childList: true, subtree: true });
  desktopMedia.addEventListener("change", scheduleMeasurement);
  window.addEventListener("resize", scheduleMeasurement);
  scheduleMeasurement();
}

installFeFilterLayoutMeasurement();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppV5 />
  </React.StrictMode>,
);