export default function Header({ mode }) {
  return (
    <header className="header">
      <h1>Profile App</h1>

      {mode === "dark" ? (
        <p>Dark Mode Enabled</p>
      ) : (
        <p>Light Mode Enabled</p>
      )}
    </header>
  );
}
