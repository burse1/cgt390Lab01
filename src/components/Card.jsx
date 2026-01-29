export default function Card({ id, name, role, image, year, major, isFeatured }) {
  const cardClass = isFeatured ? "card card--featured" : "card";

  return (
    <article className={cardClass}>
      <div className="card__imgWrap">
        <img className="card__img" src={image} alt={`${name} profile`} />
      </div>

      <div className="card__content">
        <div className="card__topRow">
          <h3 className="card__title">{name}</h3>
          <span className="card__id">#{id}</span>
        </div>

        <p className="card__role">{role}</p>

        <p className="card__meta">
          <span className="pill">{year}</span>
          <span className="pill">{major}</span>
        </p>

        {isFeatured && <p className="card__badge">Featured</p>}
      </div>
    </article>
  );
}
