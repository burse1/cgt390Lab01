import { useNavigate } from "react-router-dom";
import Section from "../components/section";
import AddProfileForm from "../components/AddProfileForm";

export default function AddProfilePage({ mode, profiles, onAddProfile }) {
  const navigate = useNavigate();

  const handleAddAndRedirect = (newProfile) => {
    onAddProfile(newProfile);
    // requirement: redirect to homepage after successful submit
    navigate("/", { replace: true });
  };

  return (
    <Section title="Add Profile">
      <AddProfileForm
        existingProfiles={profiles}
        onAddProfile={handleAddAndRedirect}
        mode={mode}
      />
    </Section>
  );
}
