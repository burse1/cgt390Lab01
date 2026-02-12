import Section from "../components/section";
import AddProfileForm from "../components/AddProfileForm";

export default function AddProfilePage({
  mode,
  profiles,
  onAddProfile
}) {
  return (
    <Section title="Add Profile">
      <AddProfileForm
        existingProfiles={profiles}
        onAddProfile={onAddProfile}
        mode={mode}
      />
    </Section>
  );
}
