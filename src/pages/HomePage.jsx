import Section from "../components/section";
import FetchedProfiles from "../components/FetchedProfiles";

export default function HomePage() {
  return (
    <Section title="Home">
      <p>Welcome to the Profile App. Use the nav to switch pages (no reload).</p>

      <FetchedProfiles mode="light" />
    </Section>
  );
}
