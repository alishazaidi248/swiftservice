'use client';
import { useState } from 'react';
import styles from "@/app/login.module.css";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase/firebase"; // Ensure this path is correct

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username.trim()) {
      setErrorMessage('First Name is required.');
      return;
    }
    if (!/^[A-Za-z]+$/.test(username)) {
      setErrorMessage('First Name must contain only letters.');
      return;
    }
    if (!contactNumber.trim()) {
      setErrorMessage('Contact Number is required.');
      return;
    }
    if (!/^\d{10}$/.test(contactNumber)) {
      setErrorMessage('Contact Number must be exactly 10 digits.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Email is required.');
      return;
    }
    if (!birthDate) {
      setErrorMessage('Birth Date is required.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Password is required.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (!confirmPassword.trim()) {
      setErrorMessage('Confirm Password is required.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data to MongoDB
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid: user.uid, email, username, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle server-side validation errors
        if (data.errors) {
          console.error('Error:', data.message);
        }
        return;
      }

      setUsername('');
      setContactNumber('');
      setEmail('');
      setBirthDate('');
      setPassword('');
      setConfirmPassword('');
      setRole('');
      setErrorMessage('');

      router.push('/login');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleNavigateToLogin = () => {
    setErrorMessage('');
    router.push('/login');
  };

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1>Register</h1>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>User Type:</label>
          <select
            className={styles.input}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="" disabled>Select User Type</option>
            <option value="customer">Register as a Customer</option>
            <option value="serviceProvider">Register as a Service Provider</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label>First Name:</label>
          <input
            className={styles.input}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Contact Number:</label>
          <input
            className={styles.input}
            type="text"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Email:</label>
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Birth Date:</label>
          <input
            className={styles.input}
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Password:</label>
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Confirm Password:</label>
          <input
            className={styles.input}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        <div className={styles.options}>
          <button type="submit" className={styles.button}>
            Submit Registration
          </button>
          <button type="button" className={styles.button} onClick={handleNavigateToLogin}>
            Go Back to Login
          </button>
        </div>
      </form>
    </main>
  );
}
