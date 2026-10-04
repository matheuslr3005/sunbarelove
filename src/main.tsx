import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/bagel-fat-one/latin-400.css";
import "@fontsource/bagel-fat-one/latin-ext-400.css";
import "@fontsource-variable/outfit/index.css";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
