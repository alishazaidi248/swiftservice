'use client'
import { useState, useEffect } from 'react';
import styles from "@/app/orders/orders.module.css";
const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        console.log('Fetched orders:', data); // Log the response for debugging
        setOrders(data.orders);
      } catch (error) {
        console.error('Fetch orders error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrders();
  }, []);
  

  return (
    <div>
      <h2>Your Orders</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        <ul>
          {orders.map((order, index) => (
            <li key={index}>
              <p><strong>Service Name:</strong> {order.serviceName}</p>
              <p><strong>Price:</strong> {order.price}</p>
              <p><strong>Booking Date:</strong> {new Date(order.bookingDate).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
