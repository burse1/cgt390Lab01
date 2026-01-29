import styles from "./Card.module.css";

export default function Card({
  id,
  name,
  role,
  image,
  year,
  major,
  isFeatured,
  mode, 
}) {
  const modeClass = mode === "dark" ? styles.dark : styles.light;

  return (
    <article className={`${styles.card} ${modeClass}`}>
      <img className={styles.image} src={image} alt={name} />

      <div className={styles.content}>
        <div className={styles.titleRow}>
          <h3>{name}</h3>
          <span>#{id}</span>
        </div>

        <p className={styles.role}>{role}</p>
        <p>
          {year} · {major}
        </p>

        {isFeatured && <p className={styles.badge}>Featured</p>}
      </div>
    </article>
  );
}
