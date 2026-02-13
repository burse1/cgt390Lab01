import { Outlet, useNavigate } from "react-router-dom";
import Section from "../components/section";

export default function ProfileLayout({ mode }) {
  const navigate = useNavigate();

  return (
    <Section title="Profile Detail">
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <button type="button" onClick={() => navigate(-1)}>
          Go Back
        </button>
        <button type="button" onClick={() => navigate("/")}>
          Home
        </button>
      </div>

      {/* Child route renders here */}
      <Outlet context={{ mode }} />
    </Section>
  );
}
