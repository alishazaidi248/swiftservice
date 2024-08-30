'use client';
import { useState, useEffect } from 'react';
import styles from "./service-provider.module.css";
import { storage } from '@/lib/firebase/firebase'; // Adjust import if necessary
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';

export default function ServiceProviderPage() {
  const [providerInfo, setProviderInfo] = useState({
    name: "",
    certifications: "",
    badges: "",
    services: [{ name: "", description: "", price: "", imageUrl: "" }]
  });
  const [userId, setUserId] = useState(null); // State to store user ID
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    // Fetch current user ID
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(data.orders);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProviderInfo({ ...providerInfo, [name]: value });
  };

  const handleServiceChange = (index, e) => {
    const { name, value } = e.target;
    const newServices = [...providerInfo.services];
    newServices[index][name] = value;
    setProviderInfo({ ...providerInfo, services: newServices });
  };

  const addService = () => {
    setProviderInfo({
      ...providerInfo,
      services: [...providerInfo.services, { name: "", description: "", price: "", imageUrl: "" }]
    });
  };

  const removeService = (index) => {
    const newServices = providerInfo.services.filter((_, i) => i !== index);
    setProviderInfo({ ...providerInfo, services: newServices });
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    const newFiles = [...selectedFiles];
    newFiles[index] = file;
    setSelectedFiles(newFiles);
  };

  const uploadImage = async (file) => {
    const fileRef = ref(storage, `images/${file.name}`);
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  };

  const sendData = async (e) => {
    e.preventDefault();
  
    try {
      if (!userId) {
        throw new Error('User not authenticated');
      }
  
      const updatedServices = await Promise.all(
        providerInfo.services.map(async (service, index) => {
          if (selectedFiles[index]) {
            const imageUrl = await uploadImage(selectedFiles[index]);
            return { ...service, imageUrl };
          }
          return service;
        })
      );
  
      const updatedProviderInfo = { ...providerInfo, services: updatedServices, userId };
  
      console.log('Sending provider info:', updatedProviderInfo); // Verify structure
  
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProviderInfo),
      });
  
      if (!response.ok) throw new Error('Failed to send data');
  
      const data = await response.json();
      console.log('Response data:', data);
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };
  

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update order status');

      const data = await response.json();
      alert('Order status updated successfully');

      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1>Service Provider Profile</h1>
      </div>
      <form onSubmit={sendData} className={styles.formContainer}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Certifications:</label>
          <input
            type="text"
            name="certifications"
            value={providerInfo.certifications}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Badges:</label>
          <input
            type="text"
            name="badges"
            value={providerInfo.badges}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className={styles.servicesSection}>
          <h2 className={styles.servicesHeader}>Services</h2>
          {providerInfo.services.map((service, index) => (
            <div key={index} className={styles.serviceItem}>
              <label className={styles.label}>Service Name:</label>
              <input
                type="text"
                name="name"
                value={service.name}
                onChange={(e) => handleServiceChange(index, e)}
                className={styles.input}
              />
              <label className={styles.label}>Description:</label>
              <input
                type="text"
                name="description"
                value={service.description}
                onChange={(e) => handleServiceChange(index, e)}
                className={styles.input}
              />
              <label className={styles.label}>Price:</label>
              <input
                type="text"
                name="price"
                value={service.price}
                onChange={(e) => handleServiceChange(index, e)}
                className={styles.input}
              />
              <label className={styles.label}>Image:</label>
              <input
                type="file"
                onChange={(e) => handleFileChange(index, e)}
                className={styles.input}
              />
              <button
                type="button"
                onClick={() => removeService(index)}
                className={styles.removeButton}
              >
                Remove Service
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addService}
            className={styles.addButton}
          >
            Add Service
          </button>
        </div>
        <button type="submit" className={styles.button}>Submit</button>
      </form>
      <div className={styles.ordersSection}>
        <h2 className={styles.ordersHeader}>Manage Orders</h2>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : orders.length === 0 ? (
          <div>No orders found.</div>
        ) : (
          <ul className={styles.ordersList}>
            {orders.map((order) => (
              <li key={order._id} className={styles.orderItem}>
                <p><strong>Service Name:</strong> {order.serviceName}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className={styles.statusSelect}
                >
                  <option value="pending">Pending</option>
                  <option value="started">Started</option>
                  <option value="delayed">Delayed</option>
                  <option value="completed">Completed</option>
                </select>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
