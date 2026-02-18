import { useNavigate } from "react-router-dom";
import Section from "../components/section";
import AddProfileForm from "../components/AddProfileForm";
import { useProfiles } from "../context/ProfilesContext";

export default function AddProfilePage() {
  const navigate = useNavigate();
  const { profiles, addProfile } = useProfiles();

  const handleAddAndRedirect = (newProfile) => {
    addProfile(newProfile);
    navigate("/", { replace: true });
  };

  return (
    <Section title="Add Profile">
      <AddProfileForm
        existingProfiles={profiles}
        onAddProfile={handleAddAndRedirect}
      />
    </Section>
  );
}
