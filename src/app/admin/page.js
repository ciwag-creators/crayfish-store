"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert("Failed to load orders");
    } else {
      setOrders(data);
    }

    setLoading(false);
  };

  if (loading) {
    return <p style={{ padding: 20 }}>Loading orders...</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>📦 Orders Dashboard</h1>

      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Qty (kg)</th>
            <th>Amount (₦)</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.customer_name}</td>
              <td>{order.phone}</td>
              <td>{order.address}</td>
              <td>{order.quantity}</td>
              <td>{order.amount}</td>
              <td>{order.payment_status}</td>
              <td>{new Date(order.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
