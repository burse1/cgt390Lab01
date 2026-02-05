import { useMemo, useState } from "react";

const stripTags = (s) => String(s ?? "").replace(/<\/?[^>]+>/g, "");
const trimCollapse = (s) => String(s ?? "").trim().replace(/\s+/g, " ");

const isValidEmail = (email) => {
  // simple + solid-enough for class
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export default function AddProfileForm({ existingProfiles, onAddProfile }) {
  const [values, setValues] = useState({
    name: "",
    title: "",
    email: "",
    bio: "",
    image: null, // File
  });

  const [errors, setErrors] = useState({
    name: "",
    title: "",
    email: "",
    bio: "",
    image: "",
    general: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const nextId = useMemo(() => {
    const maxId = existingProfiles.reduce((m, p) => Math.max(m, p.id), 0);
    return maxId + 1;
  }, [existingProfiles]);

  const validateField = (field, rawValue) => {
    if (field === "name") {
      const v = trimCollapse(stripTags(rawValue));
      if (!v) return "Name is required.";
      if (v.length < 2) return "Name must be at least 2 characters.";
      return "";
    }

    if (field === "title") {
      const v = trimCollapse(stripTags(rawValue));
      if (!v) return "Title is required.";
      if (v.length < 2) return "Title must be at least 2 characters.";
      return "";
    }

    if (field === "email") {
      const v = trimCollapse(stripTags(rawValue)).toLowerCase();
      if (!v) return "Email is required.";
      if (!isValidEmail(v)) return "Please enter a valid email address.";
      return "";
    }

    if (field === "bio") {
      const v = stripTags(String(rawValue ?? ""));
      if (v.length > 200) return "Bio must be 200 characters or less.";
      return "";
    }

    if (field === "image") {
      const file = rawValue; // File
      if (!file) return "Image is required.";
      const allowed = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
      if (!allowed.includes(file.type)) return "Image must be PNG, JPG, or GIF.";

      const maxBytes = 2 * 1024 * 1024; // 2MB
      if (file.size > maxBytes) return "Image must be 2MB or smaller.";
      return "";
    }

    return "";
  };

  const setField = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const setFieldError = (field, msg) => {
    setErrors((prev) => ({ ...prev, [field]: msg, general: "" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSuccessMessage("");
    setField(name, value);

    // light/instant validation for text fields
    if (name === "bio") {
      const msg = validateField("bio", value);
      setFieldError("bio", msg);
    } else {
      
      setFieldError(name, "");
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const msg = validateField(name, value);
    setFieldError(name, msg);
  };

  const handleFileChange = (e) => {
    setSuccessMessage("");
    const file = e.target.files?.[0] ?? null;
    setField("image", file);

    // validate immediately for file uploads
    const msg = validateField("image", file);
    setFieldError("image", msg);
  };

  const validateAll = () => {
    const newErrors = {
      name: validateField("name", values.name),
      title: validateField("title", values.title),
      email: validateField("email", values.email),
      bio: validateField("bio", values.bio),
      image: validateField("image", values.image),
      general: "",
    };

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.values(newErrors).every((v) => v === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrors((prev) => ({ ...prev, general: "" }));

    if (submitting) return;

    const ok = validateAll();
    if (!ok) return;

    // sanitize / normalize
    const cleanName = trimCollapse(stripTags(values.name));
    const cleanTitle = trimCollapse(stripTags(values.title));
    const cleanEmail = trimCollapse(stripTags(values.email)).toLowerCase();
    const cleanBio = stripTags(values.bio);

    try {
      setSubmitting(true);

      // create a local object URL for immediate display
      const imageUrl = URL.createObjectURL(values.image);

      const newProfile = {
        id: nextId,
        name: cleanName,
        role: cleanTitle, // use Title as the role/filter field
        year: "New",
        major: "Added",
        image: imageUrl,
        isFeatured: false,
        email: cleanEmail,
        bio: cleanBio,
      };

      // Simulate server request 
      await new Promise((r) => setTimeout(r, 250));

      onAddProfile(newProfile);

      setSuccessMessage("Profile added successfully!");
      setValues({ name: "", title: "", email: "", bio: "", image: null });
      e.currentTarget.reset(); // clears the file input
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        general: "Something went wrong. Please try again.",
      }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="form__header">
        <h2 className="form__title">Add Profile</h2>
        <p className="form__hint">
          Required: Name, Email, Title. Bio ≤ 200 chars. Image: PNG/JPG/GIF ≤ 2MB.
        </p>
      </div>

      {errors.general && <div className="form__alert form__alert--error">{errors.general}</div>}
      {successMessage && <div className="form__alert form__alert--success">{successMessage}</div>}

      <div className="form__grid">
        <label className="form__field">
          <span className="form__label">Name *</span>
          <input
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            minLength={2}
            maxLength={60}
            placeholder="Jane Doe"
            disabled={submitting}
          />
          {errors.name && <span className="form__error">{errors.name}</span>}
        </label>

        <label className="form__field">
          <span className="form__label">Email *</span>
          <input
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            placeholder="you@example.com"
            disabled={submitting}
          />
          {errors.email && <span className="form__error">{errors.email}</span>}
        </label>

        <label className="form__field">
          <span className="form__label">Title *</span>
          <input
            name="title"
            type="text"
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            minLength={2}
            maxLength={40}
            placeholder="Designer / Developer / PM..."
            disabled={submitting}
          />
          {errors.title && <span className="form__error">{errors.title}</span>}
        </label>

        <label className="form__field form__field--full">
          <span className="form__label">Bio (≤ 200)</span>
          <textarea
            name="bio"
            value={values.bio}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength={200}
            rows={4}
            placeholder="Short bio..."
            disabled={submitting}
          />
          <div className="form__row">
            {errors.bio && <span className="form__error">{errors.bio}</span>}
            <span className="form__count">{values.bio.length}/200</span>
          </div>
        </label>

        <label className="form__field form__field--full">
          <span className="form__label">Image *</span>
          <input
            name="image"
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/gif"
            onChange={handleFileChange}
            required
            disabled={submitting}
          />
          {errors.image && <span className="form__error">{errors.image}</span>}
        </label>
      </div>

      <button className="form__submit" type="submit" disabled={submitting}>
        {submitting ? "Submitting..." : "Add Profile"}
      </button>
    </form>
  );
}
