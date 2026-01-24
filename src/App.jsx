import Header from "./components/Header";
import Introduction from "./components/Introduction";
import Card from "./components/Card";
import Section from "./components/section";

export default function App() {
  // Parent holds the data (at least 2)
  const cards = [
    {
      id: 1,
      name: "Spencer Burse",
      year: "Junior",
      major: "CGT",
      isFeatured: true,
    },
    {
      id: 2,
      name: "Alex Example",
      year: "Sophomore",
      major: "Web Dev",
      isFeatured: false,
    },
  ];

  return (
    <div className="page">
      <Header />
      <Introduction />

      <Section title="Profiles">
        <div className="cards__grid">
          {cards.map((c) => (
            <Card
              key={c.id}
              name={c.name}
              year={c.year}
              major={c.major}
              isFeatured={c.isFeatured}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}
