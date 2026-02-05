import { useMemo, useState } from "react";
import Header from "./components/Header";
import Introduction from "./components/Introduction";
import Card from "./components/Card";
import Section from "./components/section";
import AddProfileForm from "./components/AddProfileForm";

// imgs
import p1 from "./assets/p1.jpg";
import p2 from "./assets/p2.jpg";

export default function App() {
  // lab 6: mode state
  const [mode, setMode] = useState("light");
  const toggleMode = () => setMode((m) => (m === "light" ? "dark" : "light"));

  //lab 5: filter + search state
  const [roleFilter, setRoleFilter] = useState("All");
  const [search, setSearch] = useState("");
  //lab 7
  const handleAddProfile = (newProfile) => {
  setProfiles((prev) => [...prev, newProfile]);
 
};

  // parent
  const [profiles,setProfiles] = useState([
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

  // dropdown options (dynamic)
  const roleOptions = useMemo(() => {
    const roles = Array.from(new Set(profiles.map((p) => p.role)));
    roles.sort();
    return ["All", ...roles];
  }, [profiles]);

  // filtered results
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

      {/* lab 6: conditional rendering in Header */}
      <Header mode={mode} />

      {/* lab 6: mode toggle button */}
      <button className="modeToggle" onClick={toggleMode}>
        Switch to {mode === "light" ? "Dark" : "Light"} Mode
      </button>

      <Introduction />
      <AddProfileForm existingProfiles={profiles} onAddProfile={handleAddProfile} />
      <Section title="Profiles">
        {/*lab 5 filters */}
        <div className="filters">
          <label className="filters__item">
            <span className="filters__label">Filter by role</span>
            <select
              className="filters__control"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>

          <label className="filters__item">
            <span className="filters__label">Search by name</span>
            <input
              className="filters__control"
              type="text"
              placeholder="Type a name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>

          <button className="filters__reset" onClick={handleReset}>
            Reset
          </button>
        </div>

        <p className="results">
          Showing <strong>{visibleProfiles.length}</strong> of{" "}
          <strong>{profiles.length}</strong>
        </p>

        {/* cards rendered with map + props */}
        <div className="cards__grid">
          {visibleProfiles.map((p) => (
            <Card key={p.id} {...p} mode={mode} />
          ))}
        </div>
      </Section>
    </div>
  );
}
