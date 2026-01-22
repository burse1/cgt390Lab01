export default function Card() {
  // hard-coded object inside the component (no props yet)
  const card = {
    title: "Card Title",
    description: "This is a card description using hard-coded data.",
    tag: "React",
  };

  const isFeatured = card.tag === "React";
  const cardClass = isFeatured ? "card card--featured" : "card";

  return (
    <article className={cardClass}>
      <div className="card__tag">{card.tag}</div>
      <h3 className="card__title">{card.title}</h3>
      <p className="card__desc">{card.description}</p>
    </article>
  );
}
