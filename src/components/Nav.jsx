import { NavLink } from "react-router-dom";

export default function Nav() {
  const linkStyle = ({ isActive }) => ({
    fontWeight: isActive ? 700 : 400,
    textDecoration: "none",
    marginRight: 12,
  });

  return (
    <nav style={{ padding: 12, borderBottom: "1px solid #ddd" }}>
      <NavLink to="/" style={linkStyle}>
        Home
      </NavLink>
      <NavLink to="/add" style={linkStyle}>
        Add Profile
      </NavLink>
      <NavLink to="/profiles" style={linkStyle}>
        Other Profiles
      </NavLink>
      <NavLink to="/about" style={linkStyle}>
        About
      </NavLink>
    </nav>
  );
}
