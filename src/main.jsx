import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { MediaGalleryProvider } from "./scenes/gallery/MediaGalleryContext";
import {AuthProvider} from "./scenes/global/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MediaGalleryProvider>
          <App />
        </MediaGalleryProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
