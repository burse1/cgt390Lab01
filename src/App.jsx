import { useMemo, useState } from "react";
import Header from "./components/Header";
import Introduction from "./components/Introduction";
import Card from "./components/Card";
import Section from "./components/section";

export default function App() {
  
  const profiles = [
  
    {
      id: 1,
      name: "Spencer Burse",
      role: "Developer",
      year: "Junior",
      major: "CGT",
      image: "/images/p1.jpg",
      isFeatured: true,
    },
    {
      id: 2,
      name: "Alex Rodman",
      role: "Designer",
      year: "Sophomore",
      major: "Web Dev",
      image: "/images/p2.jpg",
      isFeatured: false,
    },

   
    {
      id: 3,
      name: "Maya Chen",
      role: "Developer",
      year: "Senior",
      major: "CGT",
      image: "/images/p1.jpg",
      isFeatured: false,
    },
    {
      id: 4,
      name: "Jordan Patel",
      role: "Project Manager",
      year: "Junior",
      major: "UX",
      image: "/images/p2.jpg",
      isFeatured: false,
    },
    {
      id: 5,
      name: "Sam Rivera",
      role: "Designer",
      year: "Freshman",
      major: "Visual Comm",
      image: "/images/p1.jpg",
      isFeatured: false,
    },
    {
      id: 6,
      name: "Avery Johnson",
      role: "Researcher",
      year: "Senior",
      major: "HCI",
      image: "/images/p2.jpg",
      isFeatured: true,
    },
    {
      id: 7,
      name: "Noah Williams",
      role: "Developer",
      year: "Sophomore",
      major: "CS",
      image: "/images/p1.jpg",
      isFeatured: false,
    },
    {
      id: 8,
      name: "Leila Hassan",
      role: "Designer",
      year: "Junior",
      major: "CGT",
      image: "/images/p2.jpg",
      isFeatured: false,
    },
    {
      id: 9,
      name: "Ethan Park",
      role: "Researcher",
      year: "Sophomore",
      major: "Data Viz",
      image: "/images/p1.jpg",
      isFeatured: false,
    },
    {
      id: 10,
      name: "Priya Singh",
      role: "Project Manager",
      year: "Senior",
      major: "Management",
      image: "/images/p2.jpg",
      isFeatured: false,
    },
  ];

  //state
  const [roleFilter, setRoleFilter] = useState("All");
  const [search, setSearch] = useState("");

  // dropdown options from data
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
    <div className="page">
      <Header />
      <Introduction />

      <Section title="Profiles">
        {/* FILTER BAR */}
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

        {/* CARDS */}
        <div className="cards__grid">
          {visibleProfiles.map((p) => (
            <Card
              key={p.id}
              id={p.id}
              name={p.name}
              role={p.role}
              year={p.year}
              major={p.major}
              image={p.image}
              isFeatured={p.isFeatured}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}
