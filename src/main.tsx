import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import { App } from "./App";

import "./app/styles/index.css";

const root = document.querySelector("#root");

if (!root) {
  throw new Error("Не найден элемент #root для монтирования приложения");
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
