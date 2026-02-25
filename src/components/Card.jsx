import React from "react";
import { useMode } from "../context/ModeContext";

function Card({
  id,
  name,
  role,
  image,
  bio,
  email,
  year,
  major,
  isFeatured,
}) {
  const { mode } = useMode();

  return (
    <div className={`card ${mode} ${isFeatured ? "featured" : ""}`}>
      {image && <img src={image} alt={name} />}
      <h3>{name}</h3>
      <p><strong>Role:</strong> {role}</p>
      {year && <p><strong>Year:</strong> {year}</p>}
      {major && <p><strong>Major:</strong> {major}</p>}
      {bio && <p>{bio}</p>}
      {email && <p>{email}</p>}
    </div>
  );
}

//  prevents unnecessary re-renders
export default React.memo(Card);