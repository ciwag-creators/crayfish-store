"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const pricePerKg = 2000; // Change to your price

  const handleSubmit = async (e) => {
    e.preventDefault();

    const amount = quantity * pricePerKg;

    // Save order as pending
    const { data, error } = await supabase.from("orders").insert([
      {
        customer_name: name,
        phone: phone,
        address: address,
        quantity: quantity,
        amount: amount,
        payment_status: "pending",
      },
    ]);

    if (error) {
      setMessage("Error placing order. Try again.");
      console.log(error);
    } else {
      setMessage("Order placed! Proceed to payment.");
      console.log(data);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>TD FOODS(CRAYFISH DISTRIBUTORS) 🚀</h1>
      <p style={styles.text}>Price: ₦{pricePerKg} per kg</p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          style={styles.input}
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="text"
          placeholder="Delivery Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="number"
          placeholder="Quantity (kg)"
          value={quantity}
          min="1"
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          required
        />
        <button type="submit" style={styles.button}>
          Place Order
        </button>
      </form>

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    backgroundColor: "#fffbe6",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#d35400",
  },
  text: {
    fontSize: "1.2rem",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "100%",
    maxWidth: "400px",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "12px",
    fontSize: "1rem",
    backgroundColor: "#e67e22",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  message: {
    marginTop: "15px",
    color: "green",
    fontWeight: "bold",
  },
};
