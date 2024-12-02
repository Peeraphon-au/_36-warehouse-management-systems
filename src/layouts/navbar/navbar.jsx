import { Link, useLocation } from 'react-router-dom'; // ใช้ Link แทน link
import { IoHome } from "react-icons/io5";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { MdManageAccounts } from "react-icons/md";
import { LuPackagePlus } from "react-icons/lu";
import { TbPackageImport } from "react-icons/tb";
import { FaHouseUser } from "react-icons/fa";
import { RiLogoutBoxLine } from "react-icons/ri";

import './navbar.css';

const Navbar = ({ show, onLogout, token }) => {
    const location = useLocation();
    
    return (
        <div className={show ? 'sidenav active' : 'sidenav'}>

            <ul>
                {token === 'admin' ? (
                    // เมนูสำหรับ Admin
                    <>
                        <li className={location.pathname === '/_36-warehouse-management-system/Manager/home' ? 'active' : ''}>
                            <Link to="/_36-warehouse-management-system/Manager/home"><IoHome /> Dashboard</Link>
                        </li>
                        <li className={location.pathname === '/_36-warehouse-management-system/Manager/personnel' ? 'active' : ''}>
                            <Link to="/_36-warehouse-management-system/Manager/personnel"><BsFillPersonPlusFill /> จัดการบุคลากร</Link>
                        </li>
                        <li className={location.pathname === '/_36-warehouse-management-system/Manager/angency' ? 'active' : ''}>
                            <Link to="/_36-warehouse-management-system/Manager/angency"><MdManageAccounts /> จัดการหน่วยงาน</Link>
                        </li>
                        <li className={location.pathname === '/_36-warehouse-management-system/Manager/Received' ? 'active' : ''}>
                            <Link to="/_36-warehouse-management-system/Manager/Received"><LuPackagePlus /> รายการนำเข้าสินค้า</Link>
                        </li>
                        <li className={location.pathname === '/_36-warehouse-management-system/Manager/Withdraw' ? 'active' : ''}>
                            <Link to="/_36-warehouse-management-system/Manager/Withdraw"><TbPackageImport /> รายการเบิกสินค้า</Link>
                        </li>
                    </>
                ) : (
                    // เมนูสำหรับ User
                    <>
                        <li className={location.pathname === '/_36-warehouse-management-system/Employee/home' ? 'active' : ''}>
                            <Link to="/_36-warehouse-management-system/Employee/home"><IoHome />Dashboard</Link>
                        </li>
                        <li className={location.pathname === '/_36-warehouse-management-system/Employee/Received' ? 'active' : ''}>
                            <Link to="/_36-warehouse-management-system/Employee/Received"><LuPackagePlus /> นำเข้าสินค้า</Link>
                        </li>
                        <li className={location.pathname === '/_36-warehouse-management-system/Employee/ReceivedHistory' ? 'active' : ''}>
                            <Link to="/_36-warehouse-management-system/Employee/ReceivedHistory"><MdManageAccounts /> ประวัติการนำเข้าสินค้า</Link>
                        </li>
                        <li className={location.pathname === '/_36-warehouse-management-system/Employee/Withdraw' ? 'active' : ''}>
                            <Link to="/_36-warehouse-management-system/Employee/Withdraw"><TbPackageImport /> เบิกสินค้า</Link>
                        </li>
                        <li className={location.pathname === '/_36-warehouse-management-system/Employee/WithdrawHistory' ? 'active' : ''}>
                            <Link to="/_36-warehouse-management-system/Employee/WithdrawHistory"><FaHouseUser /> ประวัติการเบิกสินค้า</Link>
                        </li>
                    </>
                )}
                <li><Link to="/login" onClick={onLogout}><RiLogoutBoxLine />ออกจากระบบ</Link></li>
            </ul>
        </div>
    );
};

export default Navbar;
