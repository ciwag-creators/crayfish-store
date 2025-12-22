"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const pricePerKg = 2000;

const saveOrder = async (reference) => {
  const amount = quantity * pricePerKg;

  const { error } = await supabase.from("orders").insert([
    {
      customer_name: name,
      phone,
      address,
      quantity,
      amount,
      payment_reference: reference,
      payment_status: "paid",
    },
  ]);

  if (error) {
    console.error(error);
    alert("Payment received, but order saving failed.");
  } else {
    alert("Payment successful! We will contact you shortly.");
  }

  setLoading(false);
};

const payWithPaystack = () => {
  if (!window.PaystackPop) {
    alert("Payment system not ready. Please refresh.");
    return;
  }

  if (!name || !phone || !address) {
    alert("Please fill all fields");
    return;
  }

  setLoading(true);

  const amountInKobo = quantity * pricePerKg * 100;

  const handler = window.PaystackPop.setup({
    key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    email: `${phone}@crayfish.com`,
    amount: amountInKobo,
    currency: "NGN",
    ref: "CRAY_" + Date.now(),

    // ✅ MUST be a normal function
    callback: function (response) {
      saveOrder(response.reference);
    },

    onClose: function () {
      setLoading(false);
    },
  });

  handler.openIframe();
};


  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Crayfish Store 🦐</h1>
      <p>₦{pricePerKg} per kg</p>

      <input style={styles.input} placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input style={styles.input} placeholder="Phone" onChange={(e) => setPhone(e.target.value)} />
      <input style={styles.input} placeholder="Address" onChange={(e) => setAddress(e.target.value)} />
      <input
        style={styles.input}
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      />

      <button style={styles.button} onClick={payWithPaystack} disabled={loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", padding: 20, fontFamily: "Arial" },
  title: { fontSize: "2rem", fontWeight: "bold" },
  input: { padding: 10, margin: "8px 0", width: "100%" },
  button: {
    padding: 12,
    backgroundColor: "#0aa",
    color: "#fff",
    border: "none",
    fontSize: "1rem",
    cursor: "pointer",
  },
};
