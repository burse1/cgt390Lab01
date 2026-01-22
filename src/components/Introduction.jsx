export default function Introduction() {
  const name = "Spencer";
  const bio = "I’m a CGT student exploring React components and JSX.";
  const emailUser = "burse";

  return (
    <section className="intro">
      <h2>Introduction</h2>
      <p>
        Hi, I’m {name}. {bio}
      </p>
      <p className="email">
        Contact: {emailUser}@purdue.brightspace.com
      </p>
    </section>
  );
}
