export default function Card({ name, year, major, isFeatured }) {
  const cardClass = isFeatured ? "card card--featured" : "card";

  return (
    <article className={cardClass}>
      <h3 className="card__title">{name}</h3>

      <p className="card__meta">
        <span className="pill">{year}</span>
        <span className="pill">{major}</span>
      </p>

      {isFeatured && <p className="card__badge">Featured</p>}
    </article>
  );
}
