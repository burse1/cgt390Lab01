import { Link } from "react-router-dom";
import Section from "../components/section";

export default function NotFoundPage() {
  return (
    <Section title="404 - Not Found">
      <p>That page doesn’t exist.</p>
      <Link to="/">Go back home</Link>
    </Section>
  );
}
