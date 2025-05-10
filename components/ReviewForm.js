import { useState } from "react";
import styles from "../styles/ReviewForm.module.css";
import axios from "axios";

export default function ReviewForm({ onNewReview }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 0,
    notes: "",
    profilePic: null,
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      profilePic: e.target.files[0],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Trim and validate name
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      newErrors.name = "Name is required";
    } else if (trimmedName.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Validate email
    const trimmedEmail = formData.email.trim();
    if (!trimmedEmail) {
      newErrors.email = "Email is required";
    } else if (
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(trimmedEmail)
    ) {
      newErrors.email = "Please enter a valid email";
    }

    // Validate rating
    if (!formData.rating || isNaN(formData.rating)) {
      newErrors.rating = "Please select a rating";
    }

    // Review text validation
    if (!formData.notes.trim()) {
      newErrors.notes = "Please write your review";
      alert("Please write something in your review before submitting!");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //   const validateForm = () => {
  //     const newErrors = {};
  //     if (!formData.name.trim()) newErrors.name = 'Name is required';
  //     if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Valid email is required';
  //     if (formData.rating < 1) newErrors.rating = 'Please select a rating';
  //     setErrors(newErrors);
  //     return Object.keys(newErrors).length === 0;
  //   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("rating", Number(formData.rating)); // Ensure it's a number
      formDataToSend.append("notes", formData.notes);

      // Optimistic UI update
      if (onNewReview) {
        onNewReview({
          ...formData,
          _id: Date.now().toString(),
          createdAt: new Date(),
          status: "approved",
          stars: "★".repeat(formData.rating) + "☆".repeat(5 - formData.rating),
        });
      }

      if (formData.profilePic) {
        formDataToSend.append("profilePic", formData.profilePic);
      }

      const response = await axios.post("/api/reviews", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        rating: 0,
        notes: "",
        profilePic: null,
      });

      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error("Error submitting review:", error);
      setErrors({
        submit:
          error.response?.data?.error ||
          "Failed to submit review. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.reviewSection}>
      <h2 className={styles.sectionTitle}>Share Your Experience</h2>

      <form onSubmit={handleSubmit} className={styles.reviewForm}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Name*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? styles.errorInput : ""}
          />
          {errors.name && <span className={styles.error}>{errors.name}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email*</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? styles.errorInput : ""}
          />
          {errors.email && <span className={styles.error}>{errors.email}</span>}
        </div>

        <div className={styles.formGroup}>
          <label>Profile Picture</label>
          <div className={styles.fileInputContainer}>
            <input
              type="file"
              id="profilePic"
              name="profilePic"
              accept="image/*"
              onChange={handleFileChange}
              className={styles.fileInput}
            />
            <label htmlFor="profilePic" className={styles.fileInputLabel}>
              {formData.profilePic ? formData.profilePic.name : "Choose File"}
            </label>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Rating*</label>
          <div className={styles.starRating}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`${styles.star} ${
                  (hoverRating || formData.rating) >= star ? styles.filled : ""
                }`}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, rating: star }))
                }
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                ★
              </span>
            ))}
          </div>
          {errors.rating && (
            <span className={styles.error}>{errors.rating}</span>
          )}
        </div>

        {/* <div className={styles.formGroup}>
          <label htmlFor="notes">Your Review</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
          />
        </div> */}

        <div className={styles.formGroup}>
          <label htmlFor="notes">Your Review*</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            className={errors.notes ? styles.errorInput : ""}
            minLength="10" // Minimum 10 characters
          />
          <div className={styles.charCounter}>
            {formData.notes.length}/500 characters
            {formData.notes.length < 10 && (
              <span className={styles.charWarning}>
                {" "}
                (Minimum 10 characters required)
              </span>
            )}
          </div>
          {errors.notes && <span className={styles.error}>{errors.notes}</span>}
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>

        {submitSuccess && (
          <div className={styles.successMessage}>
            Thank you for your review!
          </div>
        )}
        {errors.submit && (
          <div className={styles.errorMessage}>{errors.submit}</div>
        )}
      </form>
    </div>
  );
}
