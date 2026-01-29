import { useState, useMemo } from "react";
import Header from "./components/Header";
import Introduction from "./components/Introduction";
import Card from "./components/Card";
import Section from "./components/section";

// image imports (recommended)
import p1 from "./assets/p1.jpg";
import p2 from "./assets/p2.jpg";

export default function App() {
  // 🔥 MODE STATE
  const [mode, setMode] = useState("light");

  const toggleMode = () => {
    setMode((m) => (m === "light" ? "dark" : "light"));
  };

  const profiles = [
    
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
  ];


  return (
    <div className={`page ${mode}`}>
      {/* CONDITIONAL RENDERING */}
      <Header mode={mode} />

      <button onClick={toggleMode} className="modeToggle">
        Switch to {mode === "light" ? "Dark" : "Light"} Mode
      </button>

      <Introduction />

      <Section title="Profiles">
        <div className="cards__grid">
          {profiles.map((p) => (
            <Card
              key={p.id}
              {...p}
              mode={mode} 
            />
          ))}
        </div>
      </Section>
    </div>
  );
}
