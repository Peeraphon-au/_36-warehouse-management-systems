import React, { useEffect, useState } from 'react';
import './home.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';


// ลงทะเบียน ChartJS modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Home({ received, withdraw = [], product = [] }) {
  const [latestProductDate, setLatestProductDate] = useState('');
  const [latestreceivedDate, setLatestreceivedDate] = useState('');
  const [latestWithdrawDate, setLatestWithdrawDate] = useState('');

  
  const maxLimit = 500; // จำกัดสูงสุดที่ 500

  useEffect(() => {
    // เมื่อ received เปลี่ยนแปลงให้คำนวณและอัพเดต latestReceivedDate
    setLatestreceivedDate(getLatestDate(received));
  }, [received]);

  // คำนวณเปอร์เซ็นต์ (รองรับข้อมูล 0)
  const calculatePercentage = (count, limit) => {
    if (!count || !limit) return '0.0';
    return ((count / limit) * 100).toFixed(1);
  };

  // ฟังก์ชันหา latest date
  const getLatestDate = (list) => {
    if (!list.length) return '';
    const validItems = list.filter((item) => item.date); // กรองเฉพาะรายการที่มีวันที่
    if (!validItems.length) return ''; // หากไม่มีรายการที่มีวันที่
    return validItems.reduce((latest, item) =>
      new Date(item.date) > new Date(latest.date) ? item : latest
    ).date;
  };

  // ใช้ useEffect เพื่อคำนวณวันที่ล่าสุด
  useEffect(() => {
    setLatestProductDate(getLatestDate(product));
    setLatestreceivedDate(getLatestDate(received));
    setLatestWithdrawDate(getLatestDate(withdraw));
  }, [product, received, withdraw]);

  const chartData = {
    labels: [
      latestProductDate ? new Date(latestProductDate).toLocaleDateString() : 'ไม่มีข้อมูล',
      latestreceivedDate ? new Date(latestreceivedDate).toLocaleDateString() : 'ไม่มีข้อมูล',
      latestWithdrawDate ? new Date(latestWithdrawDate).toLocaleDateString() : 'ไม่มีข้อมูล',
    ],
    datasets: [
      {
        label: 'จำนวนสินค้า',
        data: [
          Math.min(product.length, maxLimit),
          Math.min(received.length, maxLimit),
          Math.min(withdraw.length, maxLimit),
        ],
        backgroundColor: ['#3498db', '#2ecc71', '#e74c3c'],
        borderColor: ['#2980b9', '#27ae60', '#c0392b'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: maxLimit,
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="home-container">
      <main className="dashboard-content">
        <header className="dashboard-header">
          <h1>Dashboard / รายงาน</h1>
        </header>

        <div className="info-cards">
          <div className="card blue-card">
            <h2>
              {Math.min(product.length, maxLimit)} / {maxLimit}
            </h2>
            <p>จำนวนสินค้าที่อยู่ในคลัง ({calculatePercentage(product.length, maxLimit)}%)</p>
            {latestProductDate && <p>วันที่ล่าสุด: {new Date(latestProductDate).toLocaleDateString()}</p>}
          </div>
          <div className="card green-card">
            <h2>
              {Math.min(received.length, maxLimit)} / {maxLimit}
            </h2>
            <p>จำนวนสินค้าที่รับเข้า ({calculatePercentage(received.length, maxLimit)}%)</p>
            {latestreceivedDate && <p>วันที่ล่าสุด: {new Date(latestreceivedDate).toLocaleDateString()}</p>}
          </div>
          <div className="card red-card">
            <h2>
              {Math.min(withdraw.length, maxLimit)} / {maxLimit}
            </h2>
            <p>จำนวนสินค้าที่เบิกออก ({calculatePercentage(withdraw.length, maxLimit)}%)</p>
            {latestWithdrawDate && <p>วันที่ล่าสุด: {new Date(latestWithdrawDate).toLocaleDateString()}</p>}
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-wrapper" style={{ height: '400px', width: '100%' }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
