import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import EnhancedApp from "./EnhancedApp.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <EnhancedApp />
  </StrictMode>
);
