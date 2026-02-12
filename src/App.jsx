import { useMemo, useState } from "react";
import { Routes, Route } from "react-router-dom";

// Layout / Nav
import Nav from "./components/Nav";

// Pages
import HomePage from "./pages/HomePage";
import AddProfilePage from "./pages/AddProfilePage";
import OtherProfilesPage from "./pages/OtherProfilesPage";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";

// imgs
import p1 from "./assets/p1.jpg";
import p2 from "./assets/p2.jpg";

export default function App() {
  // lab 6: mode state
  const [mode, setMode] = useState("light");
  const toggleMode = () => setMode((m) => (m === "light" ? "dark" : "light"));

  // parent profiles (local)
  const [profiles, setProfiles] = useState([
    {
      id: 1,
      name: "Spencer Burse",
      role: "Developer",
      year: "Junior",
      major: "CGT",
      image: p1,
      isFeatured: true,
    },
    {
      id: 2,
      name: "Alex Rodman",
      role: "Designer",
      year: "Sophomore",
      major: "Web Dev",
      image: p1,
      isFeatured: false,
    },
    {
      id: 3,
      name: "Maya Chen",
      role: "Developer",
      year: "Senior",
      major: "CGT",
      image: p2,
      isFeatured: false,
    },
    {
      id: 4,
      name: "Jordan Patel",
      role: "Project Manager",
      year: "Junior",
      major: "UX",
      image: p1,
      isFeatured: false,
    },
    {
      id: 5,
      name: "Sam Rivera",
      role: "Designer",
      year: "Freshman",
      major: "Visual Comm",
      image: p1,
      isFeatured: false,
    },
    {
      id: 6,
      name: "Avery Johnson",
      role: "Researcher",
      year: "Senior",
      major: "HCI",
      image: p2,
      isFeatured: true,
    },
    {
      id: 7,
      name: "Noah Williams",
      role: "Developer",
      year: "Sophomore",
      major: "CS",
      image: p1,
      isFeatured: false,
    },
    {
      id: 8,
      name: "Leila Hassan",
      role: "Designer",
      year: "Junior",
      major: "CGT",
      image: p2,
      isFeatured: false,
    },
    {
      id: 9,
      name: "Ethan Park",
      role: "Researcher",
      year: "Sophomore",
      major: "Data Viz",
      image: p1,
      isFeatured: false,
    },
    {
      id: 10,
      name: "Priya Singh",
      role: "Project Manager",
      year: "Senior",
      major: "Management",
      image: p2,
      isFeatured: false,
    },
  ]);

  // lab 5: filter + search state (local list page)
  const [roleFilter, setRoleFilter] = useState("All");
  const [search, setSearch] = useState("");

  // lab 7: add profile handler (used by AddProfileForm on /add)
  const handleAddProfile = (newProfile) => {
    setProfiles((prev) => [...prev, newProfile]);
  };

  // dropdown options (dynamic)
  const roleOptions = useMemo(() => {
    const roles = Array.from(new Set(profiles.map((p) => p.role)));
    roles.sort();
    return ["All", ...roles];
  }, [profiles]);

  // filtered results for local profiles page
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
      {/* Nav always visible */}
      <Nav mode={mode} />

      {/* Mode toggle always visible */}
      <button className="modeToggle" onClick={toggleMode}>
        Switch to {mode === "light" ? "Dark" : "Light"} Mode
      </button>

      {/* Routes */}
      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={
            <HomePage
              mode={mode}
              profiles={profiles}
              visibleProfiles={visibleProfiles}
            />
          }
        />

        {/* Add Profile page (renders AddProfileForm) */}
        <Route
          path="/add"
          element={
            <AddProfilePage
              mode={mode}
              profiles={profiles}
              onAddProfile={handleAddProfile}
            />
          }
        />

        {/* Local profiles list with filters */}
        <Route
          path="/profiles"
          element={
            <OtherProfilesPage
              mode={mode}
              profiles={profiles}
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

        {/* About */}
        <Route path="/about" element={<AboutPage mode={mode} />} />

        {/* Catch-all Not Found */}
        <Route path="*" element={<NotFoundPage mode={mode} />} />
      </Routes>
    </div>
  );
}
