import { useMemo, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Nav from "./components/Nav";

import HomePage from "./pages/HomePage";
import AddProfilePage from "./pages/AddProfilePage";
import OtherProfilesPage from "./pages/OtherProfilesPage";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";

import ProfileLayout from "./pages/ProfileLayout";
import ProfileDetailPage from "./pages/ProfileDetailPage";

import { useMode } from "./context/ModeContext";
import { useProfiles } from "./context/ProfilesContext";

export default function App() {
  const { mode, toggleMode } = useMode();
  const { profiles } = useProfiles();

  // keep filters LOCAL (good example for reflection)
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
        Switch to {mode === "light" ? "Dark" : "Light"} Mode
      </button>

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

        <Route path="/profile" element={<ProfileLayout />}>
          <Route path=":id" element={<ProfileDetailPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}
