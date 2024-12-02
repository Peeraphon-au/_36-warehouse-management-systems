import { useState, useEffect, useRef } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ModalBody } from 'react-bootstrap';

import { fetchReceivedlist } from '../../../data/Received list';

import './Received.css';

const initreceivedPerPages = 10
function Received({received, setReceived}) {

    const [showPendingOnly, setShowPendingOnly] = useState(false);

    const [filteredReceived, setFilteredReceived] = useState([]);

    const [receivedRaw, setReceivedRaw] = useState([]);

    const [receivedPerPages, setReceivedPerPages] = useState(0);

    const [numPages, setNumPages] = useState(0)
    const [curPage, setCurPage] = useState(0)

    const [showYes, setShowYes] = useState(false);
    const [showNo, setShowNo] = useState(false);

    const [selectedReceived, setSelectedReceived] = useState(null); // สำหรับเก็บข้อมูลที่เลือก

    const receivedPerPagesRef = useRef()

    useEffect(() => {
        const filtered = showPendingOnly
            ? receivedRaw.filter(item => item.status === "รอการอนุมัติ")
            : receivedRaw;

        setFilteredReceived(filtered);

        // อัปเดตจำนวนหน้าใหม่
        setNumPages(Math.ceil(filtered.length / receivedPerPages));
    }, [receivedRaw, showPendingOnly, receivedPerPages]);

    useEffect(() => {
        if (numPages <= 0) setCurPage(0)
        else if (curPage === 0) setCurPage(1)
        else if (curPage > numPages) setCurPage(numPages)
    }, [numPages])


    useEffect(() => {
        setReceivedRaw(fetchReceivedlist());

        setReceivedPerPages(initreceivedPerPages)
        receivedPerPagesRef.current.value = initreceivedPerPages
    }, [])


    useEffect(() => {
        console.log(`receivedPerPages: ${receivedPerPages}`)
        setNumPages(Math.ceil(receivedRaw.length / receivedPerPages))
    }, [receivedPerPages, receivedRaw])

    useEffect(() => {
        setReceivedRaw(fetchReceivedlist());
        setCurPage(1)
    }, [])

    useEffect(() => {
        setReceived(receivedRaw)
    }, [receivedRaw, receivedPerPages])

    const handleCloseYes = () => setShowYes(false);
    const handleCloseNo = () => setShowNo(false);
    const handleShowYes = (received) => {
        setSelectedReceived(received); // เก็บข้อมูลของแถวที่เลือก
        setShowYes(true); // เปิด Modal
    };

    const handleShowNo = (received) => {
        setSelectedReceived(received); // เก็บข้อมูลของแถวที่เลือก
        setShowNo(true); // เปิด Modal
    };

    // const handleApproval = (status) => {
    //     const updatedReceived = receivedRaw.map((item) =>
    //         item.id === selectedReceived.id ? { ...item, status } : item
    //     );
    //     setReceivedRaw(updatedReceived); // อัปเดตสถานะใน receivedRaw

    //     // ค้นหาข้อมูลที่ถูกอัปเดตแล้ว
    //     const updatedItem = updatedReceived.find(item => item.id === selectedReceived.id);

    //     // แสดงข้อมูลที่อัปเดตแล้วใน Console
    //     if (updatedItem) {
    //         console.log("---------------");
    //         console.log("Received ID:", updatedItem.id);
    //         console.log("Product Name:", updatedItem.productname);
    //         console.log("Date:", updatedItem.date);
    //         console.log("Status:", updatedItem.status);
    //     }
    //     handleCloseYes(); // ปิด Modal
    //     handleCloseNo();
    // };

    const handleApproval = (status) => {
        const updatedReceived = receivedRaw.map((item) =>
            item.id === selectedReceived.id ? { ...item, status } : item
        );

        // บันทึกข้อมูลที่อัปเดตลงใน localStorage
        localStorage.setItem('receivedData', JSON.stringify(updatedReceived));

        setReceivedRaw(updatedReceived); // อัปเดตสถานะใน receivedRaw
        setReceived(fetchReceivedlist());
        // ค้นหาข้อมูลที่ถูกอัปเดตแล้ว
        const updatedItem = updatedReceived.find(item => item.id === selectedReceived.id);

        // แสดงข้อมูลที่อัปเดตแล้วใน Console
        if (updatedItem) {
            console.log("---------------");
            console.log("Received ID:", updatedItem.id);
            console.log("Product Name:", updatedItem.productname);
            console.log("Date:", updatedItem.date);
            console.log("Status:", updatedItem.status);
        }
        handleCloseYes(); // ปิด Modal
        handleCloseNo();
    };

    useEffect(() => {
        const storedReceived = localStorage.getItem('receivedData');
        if (storedReceived) {
            setReceivedRaw(JSON.parse(storedReceived)); // โหลดข้อมูลที่ถูกเก็บจาก localStorage
        } else {
            setReceivedRaw(fetchReceivedlist()); // ถ้าไม่มีข้อมูลใน localStorage ให้ดึงข้อมูลใหม่
        }
    }, []);

    return (
        <div className='received-container'>
            <h1 style={{ textAlign: 'left' }}>รายการนำเข้าสินค้า</h1>
            <div className='received-filters-container' style={{ width: '45%', alignItems: 'center' }}>
                <div className="form-check form-switch ">
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
                <select className="form-select" aria-label="Default select example" defaultValue={10} style={{ width: '250px', marginLeft: '60.5rem' }} onChange={(e) => setReceivedPerPages(e.target.value)}
                    ref={receivedPerPagesRef}
                >
                    <option value={5}>5 received per page</option>
                    <option value={10} selected>10 received per page</option>
                    <option value={50}>50 received per page</option>
                    <option value={100}>100 received per page</option>
                </select>
            </div>

            {/* Modal ของการอนุมัติ */}
            <Modal show={showYes} onHide={handleCloseYes}>

                <Modal.Header>
                    <Modal.Title><span className='bi bi-plus-lg'>&nbsp;ยืนยันการอนุมัติการนำเข้า</span></Modal.Title>
                </Modal.Header>
                <ModalBody>
                    {selectedReceived ? (
                        <p>
                            คุณต้องการอนุมัติการนำเข้า <br />
                            หมายเลขพัสดุ : <b>{selectedReceived.id}</b> <br />
                            รายการ : <b>{selectedReceived.productname}</b> <br />
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
                    <Modal.Title><span className='bi bi-plus-lg'>&nbsp;ยืนยันการไม่อนุมัติการนำเข้า</span></Modal.Title>
                </Modal.Header>
                <ModalBody>
                    {selectedReceived ? (
                        <p>
                            คุณต้องการไม่อนุมัติการนำเข้า <br />
                            หมายเลขพัสดุ : <b>{selectedReceived.id}</b> <br />
                            รายการ : <b>{selectedReceived.productname}</b> <br />
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
                    {
                        received.filter((item) => {
                            // กรองตามสถานะถ้า checkbox ถูกเปิด
                            if (showPendingOnly) {
                                return item.status === "รอการอนุมัติ";
                            }
                            return true; // แสดงทั้งหมดถ้า checkbox ปิด
                        })
                            .filter((received, index) => {
                                const min = (curPage - 1) * receivedPerPages
                                const max = (curPage * receivedPerPages) - 1
                                return index >= min && index <= max
                            })
                            .map((received) => {
                                return (
                                    <tr key={received.id}>
                                        <td valign='middle'><span className='badge bg-secondary' style={{ width: '4rem' }}>{received.id}</span></td>
                                        <td style={{ textAlign: 'center' }} valign='middle'>{received.productname}</td>
                                        <td style={{ textAlign: 'center' }} valign='middle'>{received.date}</td>
                                        <td style={{ textAlign: 'center' }} valign='middle'>
                                            {received.status === "รอการอนุมัติ" && (
                                                <>
                                                    <button
                                                        className="btn btn-success"
                                                        style={{ width: "30%", marginRight: "1.5rem" }}
                                                        onClick={() => handleShowYes(received)}
                                                    >
                                                        อนุมัติ
                                                    </button>
                                                    <button
                                                        className="btn btn-danger"
                                                        style={{ width: "30%" }}
                                                        onClick={() => handleShowNo(received)}
                                                    >
                                                        ไม่อนุมัติ
                                                    </button>
                                                </>
                                            )}
                                            {received.status === "อนุมัติ" && (
                                                <button className="btn btn-success" style={{ width: "60%" }} disabled>
                                                    อนุมัติแล้ว
                                                </button>
                                            )}
                                            {received.status === "ไม่อนุมัติ" && (
                                                <button className="btn btn-danger" style={{ width: "60%" }} disabled>
                                                    ไม่อนุมัติ
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                </tbody>
            </table>
            <div className='pagebar' style={{ padding: '0.3rem' }}>
                <button className='btn btn-outline-primary received-space'
                    onClick={() => setCurPage(1)} disabled={curPage === 1}>First</button>
                <button className='btn btn-outline-primary received-space'
                    onClick={() => curPage > 1 && setCurPage(curPage - 1)} disabled={curPage === 1}>Previous</button>
                <span className='received-space'>{curPage}&nbsp;/&nbsp;{numPages}</span>
                <button className='btn btn-outline-primary received-space'
                    onClick={() => curPage < numPages && setCurPage(curPage + 1)} disabled={curPage === numPages}>Next</button>
                <button className='btn btn-outline-primary received-space'
                    onClick={() => setCurPage(numPages)} disabled={curPage === numPages}>Last</button>
            </div>
        </div >
    )
}

export default Received;
