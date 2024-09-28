'use client';
import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [report, setReport] = useState({ weeklyCount: 0, monthlyCount: 0 });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError('Failed to fetch users');
      }
    };

    const fetchReport = async () => {
      try {
        const response = await fetch('/api/users/analytics');
        const data = await response.json();
        setReport(data);
      } catch (error) {
        setError('Failed to fetch report');
      }
    };

    fetchUsers();
    fetchReport();
  }, []);

  const handleDelete = async (userId) => {
    try {
      const response = await fetch('/api/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (response.ok) {
        setUsers(users.filter((user) => user.id !== userId));
      } else {
        setError('Failed to delete user');
      }
    } catch (error) {
      setError('Failed to delete user');
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      {error && <p>{error}</p>}
      <h2>Registration Report</h2>
      <p>Weekly Registrations: {report.weeklyCount}</p>
      <p>Monthly Registrations: {report.monthlyCount}</p>
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <p>First Name: {user.firstName}</p>
            <p>Contact Number: {user.contactNumber}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
