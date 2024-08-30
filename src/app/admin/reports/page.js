'use client';

import { useState, useEffect } from 'react';
import styles from '@/app/customer-home/home.module.css'; // Adjust styles as needed

export default function AdminReportsPage() {
  const [reportData, setReportData] = useState([]);
  const [period, setPeriod] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await fetch(`/api/reports?period=${encodeURIComponent(period)}`);
        if (!response.ok) throw new Error('Failed to fetch report data');
        const data = await response.json();
        setReportData(data.bookings);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [period]);

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1>Booking Reports</h1>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className={styles.select}
        >
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : reportData.length === 0 ? (
        <div>No bookings found.</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Service Name</th>
              <th>Bookings Count</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((item) => (
              <tr key={item.serviceName}>
                <td>{item.serviceName}</td>
                <td>{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
