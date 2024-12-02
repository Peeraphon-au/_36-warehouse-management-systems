import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { fetchReceivedlist } from './data/Received list';
import { fetchWithdrawlist } from './data/Withdraw list';
import { fetchProductlist } from './data/Productlist';

import Logo from '../public/mlogo.png'

import Navbar from './layouts/navbar/navbar';

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import './App.css'
import ManageHome from './pages/manager/Home/Home'
import Login from './pages/Login/Login';
import Managepersonnel from './pages/manager/ManagePersonnel/ManagePersonnel';
import Manageangency from './pages/manager/Agency/ManageAgency';
import Received from './pages/manager/Received/Received';
import Withdraw from './pages/manager/Withdraw/Withdraw';
import EmployeeHome from './pages/employee/EmployeeHome/home';



// employee
import PickingHistory from './pages/employee/PickingHistory/PickingHistory'
import ImportGoods from './pages/employee/Import/ImportGoods'
import ExportGoods from './pages/employee/ExportGoods/ExportGoods'
import ExportGoodsHis from './pages/employee/ExportGoodsHis/ExportGoodsHis'

function App() {
  const [token, setToken] = useState('');
  const [role, setRole] = useState('');
  const [showNav, setShowNav] = useState(true);


  const [received, setReceived] = useState([]);
  const [receivedRaw, setReceivedRaw] = useState([]);
  const [withdraw, setWithdraw] = useState([]);
  const [withdrawRaw, setWithdrawRaw] = useState([]);
  const [product, setproduct] = useState([]);
  const [productRaw, setProductRaw] = useState([]);


  useEffect(() => {
    localStorage.removeItem('receivedData'); // ลบข้อมูลเก่าทิ้ง
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem('receivedData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (Array.isArray(parsedData)) {
          setReceivedRaw(parsedData);
        } else {
          console.warn('Invalid data format in localStorage');
        }
      } catch (error) {
        console.error('Error parsing localStorage data:', error);
      }
    }
  }, []);

  useEffect(() => {
    // เมื่อ `received` เปลี่ยนแปลง จะอัพเดต `receivedRaw`
    setReceivedRaw(received);
  }, [received]); // ใช้ `received` เป็น dependency

  useEffect(() => {
    const storedData = localStorage.getItem('receivedData');
    if (storedData) {
      setReceivedRaw(JSON.parse(storedData));
    }
  }, []);


  useEffect(() => {
    setReceived(fetchReceivedlist());
    setWithdraw(fetchWithdrawlist());
    setWithdrawRaw(fetchWithdrawlist());
    setproduct(fetchProductlist());
    setProductRaw(fetchProductlist());
  }, []);

  useEffect(() => {
    console.log("Received:", received);
    console.log("ReceivedRaw:", receivedRaw);
    console.log("Withdraw:", withdraw);
    console.log("WithdrawRaw:", withdrawRaw);
    console.log("Product:", product);
    console.log("ProductRaw:", productRaw);
  }, [received, withdraw, product, receivedRaw, withdrawRaw, productRaw]);



  // ตรวจสอบ token ทุกครั้งเมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    console.log("Current Token:", token);
  }, [token]);

  const handleLogout = () => {
    setToken(''); // ล้าง token
    setRole('');  // ล้าง role
  };

  if (token === '') {
    return (
      <BrowserRouter>
        <Routes>
          {/* ส่ง setToken และ setRole ไปยัง Login Component */}
          <Route
            path="/_36-warehouse-management-system/login"
            element={<Login setToken={setToken} setRole={setRole} />}
          />
          <Route
            path="*"
            element={<Navigate to="/_36-warehouse-management-system/login" />}
          />
        </Routes>
      </BrowserRouter>
    );
  } else {
    return (
      <div className="app-container">
        <BrowserRouter>
          <div className='big-sidebar'>
            <div className='sidebarandnavbar'>
              <header className='sidebar-header'>
                <div className='sidebar-logo'>
                <img src={Logo} className="App-logo" alt="logo" />
                </div>
                {/* <div className='sidebar-button'>
                  <GiHamburgerMenu className='hamburger h1' onClick={() => setShowNav(!showNav)}/>
              </div> */}
              </header>
            </div>
            <div className='web-container'>
              <Navbar show={showNav} onLogout={handleLogout} token={token} />
              <Routes>
                {token === 'admin' ? (
                  <>
                    <Route path="*" element={<Navigate to="/_36-warehouse-management-system/Manager/home" />} />
                    <Route path="/_36-warehouse-management-system/Manager/home" element={<ManageHome received={received} setReceived={setReceived} withdraw={withdraw} setWithdraw={setWithdraw} product={product} setProduct={setproduct} receivedRaw
                      ReceivedRaw={receivedRaw} withdrawRaw={withdrawRaw} productRaw={productRaw} setReceivedRaw={setReceivedRaw} setwithdrawRaw={setWithdrawRaw} setproductRaw={setProductRaw} />} />
                    <Route path="/_36-warehouse-management-system/Manager/personnel" element={<Managepersonnel />} />
                    <Route path="/_36-warehouse-management-system/Manager/angency" element={<Manageangency />} />
                    <Route path="/_36-warehouse-management-system/Manager/Received" element={<Received received={received} setReceived={setReceived} />} />
                    <Route path="/_36-warehouse-management-system/Manager/Withdraw" element={<Withdraw withdraw={withdraw} setWithdraw={setWithdraw} />} />
                  </>
                ) : (
                  <>
                    <Route path="*" element={<Navigate to="/_36-warehouse-management-system/Employee/home" />} />
                    <Route path="/_36-warehouse-management-system/Employee/home" element={<EmployeeHome received={received} setReceived={setReceived} withdraw={withdraw} setWithdraw={setWithdraw} product={product} setProduct={setproduct} receivedRaw
                      ReceivedRaw={receivedRaw} withdrawRaw={withdrawRaw} productRaw={productRaw} setReceivedRaw={setReceivedRaw} setwithdrawRaw={setWithdrawRaw} setproductRaw={setProductRaw} />} />
                    <Route path="/_36-warehouse-management-system/Employee/ReceivedHistory" element={<PickingHistory received={received} setReceived={setReceived} />} />
                    <Route path="/_36-warehouse-management-system/Employee/Received" element={<ImportGoods received={received} setReceived={setReceived} receivedRaw={receivedRaw} setReceivedRaw={setReceivedRaw} />} />
                    <Route path="/_36-warehouse-management-system/Employee/Withdraw" element={<ExportGoods product={product} setproduct={setproduct} withdraw={withdraw} setWithdraw={setWithdraw}/>} />
                    <Route path="/_36-warehouse-management-system/Employee/WithdrawHistory" element={<ExportGoodsHis withdraw={withdraw} setWithdraw={setWithdraw} />} />
                  </>
                )}
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
