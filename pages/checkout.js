import React, { useState } from "react";
import axios from "axios";
import { useCart } from "@/components/CartContext"; // Import CartContext

export default function CheckoutPage() {
  const { cartProducts, clearCart } = useCart(); // Access cartProducts and clearCart from CartContext

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    streetAddress: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const orderData = {
        ...formData,
        cartProducts, // Include cart products from CartContext
      };

      console.log("Order Data Sent to API:", orderData); // Debugging log

      // Send the order data to the backend
      const response = await axios.post("/api/checkout", orderData);

      if (response.status === 200) {
        setSuccessMessage("Order placed successfully!");
        clearCart(); // Clear the cart after successful order
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setSuccessMessage("Failed to place the order. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Checkout</h1>
      {successMessage && (
        <p style={{ textAlign: "center", color: successMessage.includes("successfully") ? "green" : "red" }}>
          {successMessage}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="name" style={{ display: "block", marginBottom: "5px" }}>
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="email" style={{ display: "block", marginBottom: "5px" }}>
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="streetAddress" style={{ display: "block", marginBottom: "5px" }}>
            Street Address
          </label>
          <input
            type="text"
            id="streetAddress"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="city" style={{ display: "block", marginBottom: "5px" }}>
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="postalCode" style={{ display: "block", marginBottom: "5px" }}>
            Postal Code
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="country" style={{ display: "block", marginBottom: "5px" }}>
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Complete Purchase
        </button>
      </form>
    </div>
  );
}