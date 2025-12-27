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

  const sendWhatsAppAlert = (reference) => {
  const message = `
NEW CRAYFISH ORDER 🦐

Name: ${name}
Phone: ${phone}
Address: ${address}
Quantity: ${quantity} kg
Amount: ₦${quantity * pricePerKg}
Payment Ref: ${reference}
Status: PAID
`;

  const whatsappUrl = `https://wa.me/2347066922332?text=${encodeURIComponent(message)}`;

  window.open(whatsappUrl, "_blank");
};

const sendCustomerReceipt = (reference) => {
  const message = `
TD FOODS 🦐 – PAYMENT RECEIPT

Hello ${name},

Thank you for your order.

Order Details:
• Quantity: ${quantity} kg
• Price: ₦${pricePerKg}/kg
• Total Paid: ₦${quantity * pricePerKg}
• Payment Reference: ${reference}

Delivery Address:
${address}

Your order is being processed.
We will contact you shortly.

— TD Foods
`;

  // Remove leading 0 and add country code if needed
  const formattedPhone = phone.startsWith("0")
    ? "234" + phone.slice(1)
    : phone;

  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(
    message
  )}`;

  window.open(whatsappUrl, "_blank");
};


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

  setLoading(false);

  if (error) {
    console.error(error);
    alert("Payment received, but order saving failed.");
    return;
  }

  alert("Payment successful! Receipt sent via WhatsApp.");

  // ✅ ADMIN ALERT
  sendWhatsAppAlert(reference);

  // ✅ CUSTOMER RECEIPT
  sendCustomerReceipt(reference);

  // ✅ CLEAR FORM
  setName("");
  setPhone("");
  setAddress("");
  setQuantity(1);
};


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

      callback: function (response) {
        saveOrder(response.reference);
      },

      onClose: function () {
        setLoading(false);
      },
    });

    handler.openIframe();
  };

  const resetForm = () => {
  setName("");
  setPhone("");
  setAddress("");
  setQuantity(1);
};

  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        <h1 style={styles.title}>TD FOODS STORE (Crayfish) 🦐</h1>
        <p>₦{pricePerKg} per kg</p>

        {/* ✅ Proper form wrapper */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            payWithPaystack();
          }}
        >
          <input
            style={styles.input}
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <input
            style={styles.input}
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>
      </div>
    </div>
  );

const styles = {
  container: {
    minHeight: "100vh",
    padding: 20,
    fontFamily: "Arial",
    backgroundImage: "url('/images/crayfish-bg.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  overlay: {
    backgroundColor: "rgba(255,255,255,0.9)",
    maxWidth: 500,
    width: "100%",
    padding: 20,
    borderRadius: 10,
  },

  title: { fontSize: "2rem", fontWeight: "bold" },
  input: { padding: 10, margin: "8px 0", width: "100%" },
  button: {
    padding: 12,
    backgroundColor: "#0aa",
    color: "#fff",
    border: "none",
    fontSize: "1rem",
    cursor: "pointer",
    width: "100%",
  },
};
