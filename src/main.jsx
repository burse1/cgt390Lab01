import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

import { ModeProvider } from "./context/ModeContext";
import { ProfilesProvider } from "./context/ProfilesContext";
import { FetchedProfilesProvider } from "./context/FetchedProfilesContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ModeProvider>
      <ProfilesProvider>
        <FetchedProfilesProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </FetchedProfilesProvider>
      </ProfilesProvider>
    </ModeProvider>
  </React.StrictMode>
);
