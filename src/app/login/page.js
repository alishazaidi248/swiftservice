'use client';
import { useState } from 'react';
import styles from "@/app/login.module.css";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const response = await fetch(`/api/users/${user.uid}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(data);
      
      const userData = data.var_user;
      if (userData.role === 'customer') {
        router.push('/customer-home');
      } else if (userData.role === 'serviceProvider') {
        router.push('/service-provider'); 
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(error.message); 
    }
  };
  
  const handleRegisterClick = (e) => {
    e.preventDefault(); 
    router.push('/register'); 
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <img src="/images/bird.png" alt="Service Image" className={styles.image} />
        </div>
        <form className={styles.formContainer} onSubmit={handleLogin}>
          <div className={styles.formBox}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email:</label>
              <input
                className={styles.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Password:</label>
              <input
                className={styles.input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {errorMessage && <p className={styles.error}>{errorMessage}</p>} 
            <div className={styles.options}>
              <button className={styles.button} type="submit">
                Login
              </button>
            </div>
            <p className={styles.text}>Don't have an account? Register</p>
            <button className={styles.button} onClick={handleRegisterClick} type="button">
              Register
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
