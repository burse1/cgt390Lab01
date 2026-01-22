import Header from "./components/Header";
import Introduction from "./components/Introduction";
import Card from "./components/Card";

export default function App() {
  return (
    <div className="page">
      <Header />
      <Introduction />

      <section className="cards">
        <h2>Cards</h2>
        <div className="cards__grid">
          <Card />
          <Card />
        </div>
      </section>
    </div>
  );
}
