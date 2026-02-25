import React, { Suspense, useMemo, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Nav from "./components/Nav";

import HomePage from "./pages/HomePage";
import OtherProfilesPage from "./pages/OtherProfilesPage";
import ProfileLayout from "./pages/ProfileLayout";
import NotFoundPage from "./pages/NotFoundPage";

import { useMode } from "./context/ModeContext";
import { useProfiles } from "./context/ProfilesContext";

// lazy load non-critical routes/pages
const AboutPage = React.lazy(() => import("./pages/AboutPage"));
const AddProfilePage = React.lazy(() => import("./pages/AddProfilePage"));
const ProfileDetailPage = React.lazy(() => import("./pages/ProfileDetailPage"));

export default function App() {
  const { mode, toggleMode } = useMode();
  const { profiles } = useProfiles();

  // keep page-only filters local
  const [roleFilter, setRoleFilter] = useState("All");
  const [search, setSearch] = useState("");

  const roleOptions = useMemo(() => {
    const roles = Array.from(new Set(profiles.map((p) => p.role)));
    roles.sort();
    return ["All", ...roles];
  }, [profiles]);

  const visibleProfiles = useMemo(() => {
    const s = search.trim().toLowerCase();
    return profiles.filter((p) => {
      const matchesRole = roleFilter === "All" ? true : p.role === roleFilter;
      const matchesSearch = s === "" ? true : p.name.toLowerCase().includes(s);
      return matchesRole && matchesSearch;
    });
  }, [profiles, roleFilter, search]);

  const handleReset = () => {
    setRoleFilter("All");
    setSearch("");
  };

  return (
    <div className={`page ${mode}`}>
      <Nav />

      <button className="modeToggle" onClick={toggleMode}>
        Switch to {mode === "light" ? "Dark" : "light"} Mode
      </button>

      <Suspense fallback={<p style={{ padding: 12 }}>Loading…</p>}>
        <Routes>
          <Route
            path="/"
            element={<HomePage visibleProfiles={visibleProfiles} />}
          />

          <Route path="/add" element={<AddProfilePage />} />

          <Route
            path="/profiles"
            element={
              <OtherProfilesPage
                visibleProfiles={visibleProfiles}
                roleFilter={roleFilter}
                setRoleFilter={setRoleFilter}
                search={search}
                setSearch={setSearch}
                roleOptions={roleOptions}
                onReset={handleReset}
              />
            }
          />

          <Route path="/about" element={<AboutPage />} />

          {/* Lab 10 nested + dynamic */}
          <Route path="/profile" element={<ProfileLayout />}>
            <Route path=":id" element={<ProfileDetailPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}