import { useState, useEffect, useRef } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ModalBody } from 'react-bootstrap';


import './Withdraw.css';

const initwithdrawPerPages = 10
function Withdraw({ withdraw, setWithdraw }) {

    const [showPendingOnly, setShowPendingOnly] = useState(false);
    const [filteredWithdraw, setFilteredWithdraw] = useState([]);

    const [withdrawRaw, setWithdrawRaw] = useState([]);

    const [withdrawPerPages, setwithdrawPerPages] = useState(0);

    const [numPages, setNumPages] = useState(0)
    const [curPage, setCurPage] = useState(0)

    const [showYes, setShowYes] = useState(false);
    const [showNo, setShowNo] = useState(false);

    const [selectedWithdraw, setSelectedWithdraw] = useState(null); // สำหรับเก็บข้อมูลที่เลือก

    const withdrawPerPagesRef = useRef()

    useEffect(() => {
        // ตรวจสอบข้อมูลที่ได้รับ
        console.log(withdraw);
    }, [withdraw]);


    useEffect(() => {
        const filtered = showPendingOnly
            ? withdrawRaw.filter((item) => item.status === "รอการอนุมัติ")
            : withdrawRaw;
    
        setFilteredWithdraw(filtered);
    
        // อัปเดตจำนวนหน้าใหม่
        setNumPages(Math.ceil(filtered.length / withdrawPerPages));
    }, [withdrawRaw, showPendingOnly, withdrawPerPages]);


    useEffect(() => {
        if (numPages <= 0) setCurPage(0)
        else if (curPage === 0) setCurPage(1)
        else if (curPage > numPages) setCurPage(numPages)
    }, [numPages])


    useEffect(() => {
        setWithdrawRaw(withdraw);


        setwithdrawPerPages(initwithdrawPerPages)
        withdrawPerPagesRef.current.value = initwithdrawPerPages
    }, [])


    useEffect(() => {
        console.log(`withdrawPerPages: ${withdrawPerPages}`)
        setNumPages(Math.ceil(withdrawRaw.length / withdrawPerPages))
    }, [withdrawPerPages, withdrawRaw])

    useEffect(() => {
        setWithdrawRaw(withdraw);
        setCurPage(1)
    }, [])

    useEffect(() => {
        setWithdraw(withdrawRaw)
    }, [withdrawRaw, withdrawPerPages])

    const handleCloseYes = () => setShowYes(false);
    const handleCloseNo = () => setShowNo(false);
    const handleShowYes = (withdraw) => {
        setSelectedWithdraw(withdraw); // เก็บข้อมูลของแถวที่เลือก
        setShowYes(true); // เปิด Modal
    };

    const handleShowNo = (withdraw) => {
        setSelectedWithdraw(withdraw); // เก็บข้อมูลของแถวที่เลือก
        setShowNo(true); // เปิด Modal
    };

    const handleApproval = (status) => {
        const updatedWithdraw = withdrawRaw.map((item) =>
            item.id === selectedWithdraw.id ? { ...item, status } : item
        );
    
        // อัปเดต withdrawRaw
        setWithdrawRaw(updatedWithdraw);
    
        // เก็บข้อมูลที่อัปเดตลงใน localStorage
        localStorage.setItem('withdrawData', JSON.stringify(updatedWithdraw));
    
        // ปิด Modal หลังจากอนุมัติหรือไม่อนุมัติ
        handleCloseYes();
        handleCloseNo();
    };
    

    useEffect(() => {
        const storedWithdraw = localStorage.getItem('withdrawData');
        if (storedWithdraw) {
            const parsedData = JSON.parse(storedWithdraw);
            setWithdrawRaw(parsedData);
        } else {
            setWithdrawRaw(withdraw);
        }
    }, []);
    
    useEffect(() => {
        console.log("Current Withdraw:", withdraw);
        console.log("Withdraw Raw Data:", withdrawRaw);
        console.log("Filtered Withdraw Data:", filteredWithdraw);
    }, [withdrawRaw, filteredWithdraw, withdraw]);
    

    useEffect(() => {
        const storedWithdraw = localStorage.getItem('withdrawData');
        console.log("LocalStorage Withdraw Data:", storedWithdraw);
    }, []);
    
    

    return (
        <div className='withdraw-container'>
            <h1 style={{ textAlign: 'left' }}>รายการเบิกออกสินค้า</h1>
            <div className='withdraw-filters-container' style={{ width: '45%' }}>
                <div className="form-check form-switch">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckChecked"
                        onChange={(e) => setShowPendingOnly(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="flexSwitchCheckChecked" style={{ width: '430px', textAlign: 'left' }}>
                        แสดงรายการที่รอการอนุมัติ
                    </label>
                </div>
                <select className="form-select" aria-label="Default select example" defaultValue={10} style={{ width: '250px', marginLeft: '60rem' }} onChange={(e) => setwithdrawPerPages(e.target.value)}
                    ref={withdrawPerPagesRef}
                >
                    <option value={5}>5 withdraw per page</option>
                    <option value={10} selected>10 withdraw per page</option>
                    <option value={50}>50 withdraw per page</option>
                    <option value={100}>100 withdraw per page</option>
                </select>
            </div>

            {/* Modal ของการอนุมัติ */}
            <Modal show={showYes} onHide={handleCloseYes}>

                <Modal.Header>
                    <Modal.Title><span className='bi bi-plus-lg'>&nbsp;ยืนยันการอนุมัติการเบิก</span></Modal.Title>
                </Modal.Header>
                <ModalBody>
                    {selectedWithdraw ? (
                        <p>
                            คุณต้องการอนุมัติการเบิก <br />
                            หมายเลขพัสดุ : <b>{selectedWithdraw.id}</b> <br />
                            รายการ : <b>{selectedWithdraw.productname}</b> <br />
                            ใช่หรือไม่?
                        </p>
                    ) : (
                        <p>ไม่มีข้อมูลพัสดุ</p>
                    )}
                </ModalBody>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseYes}>
                        <span className='bi bi-x-lg'>&nbsp;ยกเลิก</span>
                    </Button>
                    <Button variant="primary" onClick={() => {
                        handleApproval('อนุมัติ')
                    }}>
                        <span className='bi bi-plus-lg'>&nbsp;ยืนยัน</span>
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal ของการไม่อนุมัติ */}
            <Modal show={showNo} onHide={handleCloseYes}>

                <Modal.Header>
                    <Modal.Title><span className='bi bi-plus-lg'>&nbsp;ยืนยันการไม่อนุมัติการเบิก</span></Modal.Title>
                </Modal.Header>
                <ModalBody>
                    {selectedWithdraw ? (
                        <p>
                            คุณต้องการไม่อนุมัติการเบิก <br />
                            หมายเลขพัสดุ : <b>{selectedWithdraw.id}</b> <br />
                            รายการ : <b>{selectedWithdraw.productname}</b> <br />
                            ใช่หรือไม่?
                        </p>
                    ) : (
                        <p>ไม่มีข้อมูลพัสดุ</p>
                    )}
                </ModalBody>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseNo}>
                        <span className='bi bi-x-lg'>&nbsp;ยกเลิก</span>
                    </Button>
                    <Button variant="primary" onClick={() => {
                        handleApproval('ไม่อนุมัติ')
                    }}>
                        <span className='bi bi-plus-lg'>&nbsp;ยืนยัน</span>
                    </Button>
                </Modal.Footer>
            </Modal>

            <table className='table table-striped'>
                <thead className='table-dark'>
                    <tr>
                        <th style={{ width: '5%' }} valign='middle'>หมายเลขพัสดุ</th>
                        <th valign='middle'>ชื่อพัสดุ</th>
                        <th valign='middle'>วันที่รับพัสดุ</th>
                        <th valign='middle'>สถานะ</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredWithdraw.filter((received, index) => {
                            const min = (curPage - 1) * withdrawPerPages
                            const max = (curPage * withdrawPerPages) - 1
                            return index >= min && index <= max
                        })
                        .map((item, index) => (
                            <tr key={index}>
                                <td valign="middle">
                                    <span className='badge bg-secondary' style={{ width: '4rem' }}>
                                        {item.id}
                                    </span>
                                </td>
                                <td style={{ textAlign: "center" }} valign="middle">
                                    {item.productname}
                                </td>
                                <td style={{ textAlign: "center" }} valign="middle">
                                    {item.date}
                                </td>
                                <td style={{ textAlign: "center" }} valign="middle">
                                    {item.status === "รอการอนุมัติ" ? (
                                        <>
                                            <button
                                                className="btn btn-success"
                                                style={{ width: "30%", marginRight: "1.5rem" }}
                                                onClick={() => handleShowYes(item)}
                                            >
                                                อนุมัติ
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                style={{ width: "30%" }}
                                                onClick={() => handleShowNo(item)}
                                            >
                                                ไม่อนุมัติ
                                            </button>
                                        </>
                                    ) : item.status === "อนุมัติ" ? (
                                        <button className="btn btn-success" style={{ width: "60%" }} disabled>
                                            อนุมัติแล้ว
                                        </button>
                                    ) : (
                                        <button className="btn btn-danger" style={{ width: "60%" }} disabled>
                                            ไม่อนุมัติ
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
            <div className='pagebar'>
                <button className='btn btn-outline-primary withdraw-space'
                    onClick={() => setCurPage(1)} disabled={curPage === 1}>First</button>
                <button className='btn btn-outline-primary withdraw-space'
                    onClick={() => curPage > 1 && setCurPage(curPage - 1)} disabled={curPage === 1}>Previous</button>
                <span className='withdraw-space'>{curPage}&nbsp;/&nbsp;{numPages}</span>
                <button className='btn btn-outline-primary withdraw-space'
                    onClick={() => curPage < numPages && setCurPage(curPage + 1)} disabled={curPage === numPages}>Next</button>
                <button className='btn btn-outline-primary withdraw-space'
                    onClick={() => setCurPage(numPages)} disabled={curPage === numPages}>Last</button>
            </div>
        </div >
    )
}

export default Withdraw;