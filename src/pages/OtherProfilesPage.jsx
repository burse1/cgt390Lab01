import Section from "../components/section";
import FetchedProfiles from "../components/FetchedProfiles";

export default function OtherProfilesPage() {
  return (
    <Section title="Other Profiles">
      <p>Browse profiles pulled from the API.</p>
      <FetchedProfiles mode="light" />
    </Section>
  );
}
