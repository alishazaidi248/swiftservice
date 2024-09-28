'use client';

import { useState, useEffect } from 'react';
import styles from './home.module.css';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';
import { useRouter } from 'next/navigation';

export default function CustomerHomePage() {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [selectedPage, setSelectedPage] = useState('home');
  const [profilePicture, setProfilePicture] = useState(null);

  const router = useRouter();

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services'); 
        if (!response.ok) throw new Error('Failed to fetch services');
        const data = await response.json();
        const servicesData = data.services.flatMap(item => item.services);
        setServices(servicesData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const response = await fetch(`/api/user/${user.uid}`);
          if (response.ok) {
            const data = await response.json();
            setProfilePicture(data.profilePicture);
          } else {
            console.error('Failed to fetch profile picture');
          }
        } catch (error) {
          console.error('Error fetching profile picture:', error);
        }
      }
    };
    fetchProfilePicture();
  }, []);

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePicture(imageUrl); 

      const formData = new FormData();
      formData.append('profilePicture', file);

      try {
        const response = await fetch('/api/upload-profile-picture', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setProfilePicture(data.profilePictureUrl); 
        } else {
          console.error('Failed to upload profile picture');
        }
      } catch (error) {
        console.error('Error uploading profile picture:', error);
      }
    }
  };

  

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setBookingDate('');
  };

  const handleBooking = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert('You must be logged in to book a service');
        return;
      }

      const userId = user.uid;

      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          serviceId: selectedService._id, 
          userId: userId, 
          bookingDate 
        }),
      });

      alert(`Service booked: ${selectedService.name} on ${bookingDate}`);
      setSelectedService(null);
    } catch (error) {
      console.error('Error booking service:', error);
      alert('Failed to book service');
    }
  };

  const renderPageContent = () => {
    switch (selectedPage) {
      case 'orders':
        return <OrdersPage />;
      case 'settings':
        return <SettingsPage />;
      case 'profile':
        return (
          <div>
            <h2>Profile/Account</h2>
            {profilePicture ? (
                  <img src={profilePicture} alt="Profile Picture" className={styles.profilePicture} />
                ) : (
                  <p>No profile picture</p>
                )}

                <input type="file" accept="image/*" onChange={handleProfilePictureUpload} />

          </div>
        );
        
      default:
        return (
          <div className={styles.services}>
            {loading ? (
              <div className={styles.loader}>Loading...</div>
            ) : error ? (
              <div className={styles.error}>{error}</div>
            ) : (
              <div className={styles.serviceList}>
                {services
                  .filter(service => service.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((service, index) => (
                    <div key={index} className={styles.serviceCard} onClick={() => handleServiceClick(service)}>
                      <h3>{service.name}</h3>
                      <p>{service.description}</p>
                      <p><strong>Price:</strong> ₹{service.price || "N/A"}</p>
                      {service.imageUrl ? (
                        <img src={service.imageUrl} alt={service.name} className={styles.serviceImage} />
                      ) : (
                        <p>No image available</p>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <img src="/images/bird.png" alt="Logo" className={styles.logo} />
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </header>
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <button onClick={() => setSelectedPage('home')} className={styles.navButton}>Home</button>
          <div className={styles.separator}></div>
          <button onClick={() => setSelectedPage('profile')} className={styles.navButton}>Customer Profile/Account</button>
          <div className={styles.separator}></div>
          <button onClick={() => setSelectedPage('orders')} className={styles.navButton}>Orders</button>
          <div className={styles.separator}></div>
          <button onClick={() => setSelectedPage('settings')} className={styles.navButton}>Settings</button>
        </aside>

        <div className={styles.content}>
          {renderPageContent()}
          {selectedService && selectedPage === 'home' && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <span className={styles.close} onClick={() => setSelectedService(null)}>×</span>
                <h2>{selectedService.name}</h2>
                <p>{selectedService.description}</p>
                <p><strong>Price: ₹{selectedService.price}</strong></p>
                {selectedService.imageUrl ? (
                  <img src={selectedService.imageUrl} alt={selectedService.name} className={styles.modalImage} />
                ) : (
                  <p>No image available</p>
                )}
                <label>
                  Booking Date:
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]} 
                  />
                </label>
                <button onClick={handleBooking}>Book Now</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <footer className={styles.footer}>
        <p>Contact us: haha@gmail.com</p>
        <p>Follow us on <a href="#">Twitter</a> | <a href="#">Facebook</a></p>
      </footer>
    </main>
  );
}

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders'); // Adjusted for App Router
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
        <ul className={styles.ordersList}>
          {orders.map((order, index) => (
            <li key={index} className={styles.orderItem}>
              <p><strong>Service Name:</strong> {order.serviceName}</p>
              <p><strong>Price:</strong> ₹{order.price}</p>
              <p><strong>Booking Date:</strong> {new Date(order.bookingDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {order.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


const SettingsPage = () => (
  <div>
    <h2>Settings</h2>
    {}
  </div>
);
