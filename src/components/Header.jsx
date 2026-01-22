export default function Header() {
  // hard-coded variables (no props yet)
  const course = "CGT 390";
  const lab = "Lab 01";
  const name = "Spencer Burse";

  // dynamic className example
  const isHighlight = true;
  const titleClass = isHighlight ? "title title--highlight" : "title";

  return (
    <header className="header">
      <p className="kicker">{course}</p>
      <h1 className={titleClass}>{lab}</h1>
      <p className="byline">Built by {name}</p>
    </header>
  );
}
