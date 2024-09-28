'use client';
import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto'; // Automatically registers all chart types.
import styles from '@/app/admin/reports/AdminPanel.module.css';

export default function ReportsPage() {
  const [reportData, setReportData] = useState(null);
  const [selectedReport, setSelectedReport] = useState('totalUsers');

  useEffect(() => {
    async function fetchReport() {
      const response = await fetch('/api/reports');
      const data = await response.json();
      setReportData(data);
    }

    fetchReport();
  }, []);

  if (!reportData) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const renderReportCharts = () => {
    switch (selectedReport) {
      case 'totalUsers':
        const userChartData = {
          labels: reportData.ordersByUser.map(user => `User ${user._id}`),
          datasets: [
            {
              label: 'Total Orders by Users',
              data: reportData.ordersByUser.map(user => user.totalOrders),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        };
        return (
          <div className={styles.chartContainer}>
            <Bar data={userChartData} options={{ responsive: true }} />
            <div className={styles.totalCard}>Total Users: {reportData.totalUsers}</div>
          </div>
        );

      case 'totalServices':
        const serviceChartData = {
          labels: reportData.ordersByService.map(service => `Service ${service._id}`),
          datasets: [
            {
              label: 'Total Revenue by Services',
              data: reportData.ordersByService.map(service => service.totalRevenue),
              backgroundColor: 'rgba(153, 102, 255, 0.6)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1,
            },
          ],
        };
        return (
          <div className={styles.chartContainer}>
            <Bar data={serviceChartData} options={{ responsive: true }} />
            <div className={styles.totalCard}>Total Services: {reportData.totalServices}</div>
          </div>
        );

      case 'totalOrders':
        const orderStatusChartData = {
          labels: reportData.ordersByStatus.map(status => `Status: ${status._id}`),
          datasets: [
            {
              label: 'Orders by Status',
              data: reportData.ordersByStatus.map(status => status.count),
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
              ],
              borderWidth: 1,
            },
          ],
        };
        return (
          <div className={styles.chartContainer}>
            <Pie data={orderStatusChartData} options={{ responsive: true }} />
            <div className={styles.totalCard}>Total Orders: {reportData.totalOrders}</div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.adminPanel}>
        <h1 className={styles.title}>Admin Reports</h1>
        <div className={styles.dropdownContainer}>
          <label htmlFor="reportSelect" className={styles.dropdownLabel}>Select Report:</label>
          <select
            id="reportSelect"
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className={styles.dropdown}
          >
            <option value="totalUsers">Total Users</option>
            <option value="totalServices">Total Services</option>
            <option value="totalOrders">Total Orders</option>
          </select>
        </div>
        {renderReportCharts()}
      </div>
    </main>
  );
}
