import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { MediaGalleryProvider } from "./scenes/gallery/MediaGalleryContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <MediaGalleryProvider>
        <App />
      </MediaGalleryProvider>
    </BrowserRouter>
  </React.StrictMode>
);
