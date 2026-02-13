import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Card from "../components/Card";

export default function ProfileDetailPage({ mode }) {
  const { id } = useParams();
  const location = useLocation();

  // If you navigate here with state, we can use it immediately:
  // navigate(`/profile/${id}`, { state: { profile: someProfile } })
  const stateProfile = location.state?.profile ?? null;

  const [profile, setProfile] = useState(stateProfile);
  const [loading, setLoading] = useState(!stateProfile);
  const [error, setError] = useState("");

  useEffect(() => {
    // If we already have a profile from state, no need to fetch
    if (stateProfile) return;

    const controller = new AbortController();

    async function run() {
      try {
        setLoading(true);
        setError("");

        const url = `https://web.ics.purdue.edu/~zong6/profile-app/fetch-data-with-id.php?id=${encodeURIComponent(
          id
        )}`;

        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error("Failed to load profile");

        const data = await res.json();

        // API might return object directly or wrap it; normalize:
        const p = data?.profile ?? data;

        if (!p || typeof p !== "object") {
          throw new Error("Profile not found");
        }

        // Normalize to Card props your app expects
        const normalized = {
          id: Number(p.id) || p.id || id,
          name: p.name ?? "Unnamed",
          role: p.title ?? p.role ?? "Untitled",
          image: p.image_url ?? p.image ?? "",
          bio: p.bio ?? "",
          email: p.email ?? "",
          year: p.year ?? "API",
          major: p.major ?? "Fetched",
          isFeatured: false,
        };

        setProfile(normalized);
      } catch (e) {
        if (e.name !== "AbortError") setError("Could not load profile.");
      } finally {
        setLoading(false);
      }
    }

    run();
    return () => controller.abort();
  }, [id, stateProfile]);

  if (loading) return <p className="apiHint">Loading…</p>;
  if (error) return <p className="apiError">{error}</p>;
  if (!profile) return <p className="apiHint">No profile found.</p>;

  return (
    <div>
      {/* Reuse your Card UI */}
      <Card {...profile} mode={mode} />

      {/* Extra details if you want */}
      {profile.bio && (
        <p style={{ marginTop: 12, lineHeight: 1.5 }}>{profile.bio}</p>
      )}
      {profile.email && (
        <p style={{ marginTop: 8 }}>
          <strong>Email:</strong> {profile.email}
        </p>
      )}
    </div>
  );
}
