import './ImportGoods.css';
import { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { fetchReceivedlist } from '../../../data/Received list';
const initReceivedPerPage = 10;
function ImportGoods({ received, setReceived}) {
    const [receivedRaw, setReceivedRaw] = useState([]);
    const [receivedPerPage, setReceivedPerPage] = useState(0);
    const [numPages, setNumPages] = useState(0);
    const [curPage, setCurPage] = useState(1);
    const [trackingNumber, setTrackingNumber] = useState('');

    const receivedPerPageRef = useRef();

    const newIdRef = useRef();
    const newNameRef = useRef();
    const newTypeRef = useRef();

    // สุ่มหมายเลขพัสดุครั้งแรก
    useEffect(() => {
        const generatedTrackingNumber = generateTrackingNumber();
        setTrackingNumber(generatedTrackingNumber);
    }, []);

    // Add goods modal
    const [addGoods, setAddGoods] = useState(false);
    const showAddGoods = () => {
        const newTrackingNumber = generateTrackingNumber();
        setTrackingNumber(newTrackingNumber);  // อัพเดตค่าหมายเลขพัสดุใหม่
        setAddGoods(true)};
    const hideAddGoods = () => setAddGoods(false);

    const generateTrackingNumber = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let trackingNumber = '';
        
        // สุ่มเลข 5 ตัว
        for (let i = 0; i < 5; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          trackingNumber += characters[randomIndex];
        }
        
        return trackingNumber;
      };

      const addClick = (id, productName, productType) => {
        id = trackingNumber;
        if (receivedRaw.some(item => item.id === trackingNumber)) {
            alert("หมายเลขพัสดุซ้ำ!");
            return;
        }
    
        const productDisplayName = productType === "แตกหักง่าย"
            ? `${productName} (${productType})`
            : productName;
    
        const newItem = {
            id: trackingNumber,
            productname: productDisplayName,
            producttype: productType,
            date: new Date().toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' }),
            status: "รอการอนุมัติ"
        };
    
        const updatedReceived = [...receivedRaw, newItem];
        setReceivedRaw(updatedReceived);
        localStorage.setItem('receivedData', JSON.stringify(updatedReceived));
        hideAddGoods();
    };

    // Details modal
    const [details, setDetails] = useState(false);
    const showDetails = (received) => {
        setDetails(true);
        setTimeout(() => {
            if (newIdRef.current) newIdRef.current.value = received.id || '';
            if (newNameRef.current) newNameRef.current.value = received.productname || '';
            if (newTypeRef.current) newTypeRef.current.value = received.producttype || '';
        }, 0);
    };

    const hideDetails = () => setDetails(false);

    const editClick = (id, productName, productType) => {
        const productDisplayName = productType === "แตกหักง่าย"
            ? `${productName} (${productType})`
            : productName;

        const updatedReceived = receivedRaw.map((received) =>
            received.id.toString() === id.toString()
                ? { ...received, productname: productDisplayName, producttype: productType }
                : received
        );
        setReceivedRaw(updatedReceived);
        localStorage.setItem('receivedData', JSON.stringify(updatedReceived));  // Save to localStorage
        hideDetails();
    };

    // Update page count
    useEffect(() => {
        console.log(`receivedPerPages: ${receivedPerPage}`)
        setNumPages(Math.ceil(receivedRaw.length / receivedPerPage)); // คำนวณจำนวนหน้าจากข้อมูลทั้งหมด
    }, [receivedPerPage, receivedRaw]);

    useEffect(() => {
        if (numPages <= 0) setCurPage(0)
        else if (curPage === 0) setCurPage(1)
        else if (curPage > numPages) setCurPage(numPages)
    }, [numPages])

    useEffect(() => {
        const storedData = localStorage.getItem('receivedData');
        if (storedData) {
            setReceivedRaw(JSON.parse(storedData));
        } else {
            const data = fetchReceivedlist();
            setReceivedRaw(data);
            localStorage.setItem('receivedData', JSON.stringify(data));
        }
    }, []);

      // Initialize data and defaults from localStorage
      useEffect(() => {
        const storedData = localStorage.getItem('receivedData');
        if (storedData) {
            setReceivedRaw(JSON.parse(storedData));  // Load data from localStorage
        } else {
            setReceivedRaw(received);  // If no data in localStorage, use the passed received data
            localStorage.setItem('receivedData', JSON.stringify(received));  // Save initial data to localStorage
        }
    }, [received]);

    useEffect(() => {
        const data = fetchReceivedlist();
        setReceivedRaw(data);
        setReceivedPerPage(initReceivedPerPage);
        if (receivedPerPageRef.current) {
            receivedPerPageRef.current.value = initReceivedPerPage;
        }
    }, []);

    useEffect(() => {
        console.log('receivedRaw updated:', receivedRaw);
    }, [receivedRaw]);

    useEffect(() => {
        setReceived(receivedRaw)
    }, [receivedRaw, receivedPerPage])

    return (
        <div className='import-container'>
            <h1 style={{ textAlign: 'center', paddingTop: '20px' }}>รายการนำสินค้าเข้า</h1>
            <div className="container">
                <div className="showItems">
                    <button className="btn btn-primary btn-sm" onClick={showAddGoods}>เพิ่มรายการ</button>
                    <select
                        className="form-select"
                        style={{ width: '150px' }}
                        aria-label="Default select example"
                        defaultValue={10}
                        onChange={(e) => setReceivedPerPage(e.target.value)}
                        ref={receivedPerPageRef}
                    >
                        <option value={5}>5 per page</option>
                        <option value={10} selected>10 per page</option>
                        <option value={50}>50 per page</option>
                        <option value={100}>100 per page</option>
                    </select>
                </div>
                <table className="tables">
                    <thead>
                        <tr>
                            <th className="headerTable" id='table'>รหัสสินค้า</th>
                            <th className="headerTable" id='table'>รายการ</th>
                            <th className="headerTable" id='table'>รายละเอียด</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        received.filter((received, index) => {
                            const min = (curPage - 1) * receivedPerPage
                            const max = (curPage * receivedPerPage) - 1
                            return index >= min && index <= max
                        })
                        .map((receivedItem) => (
                            <tr key={receivedItem.id}>
                                <td valign="middle" style={{ width: '6rem',textAlign: 'center' }} id='table'><span className='badge bg-secondary' style={{ width: '4rem' }}>{receivedItem.id}</span></td>
                                <td style={{ textAlign: 'left' }} valign="middle" id='table'>{receivedItem.productname}</td>
                                <td style={{ width: '7rem',textAlign: 'center' }} id='table'>
                                    <button
                                        className="btn btn-primary btn-sm bi bi-pencil-square"
                                        onClick={() => showDetails(receivedItem)}
                                    ></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="command" style={{ marginTop: '50px', marginBottom: '25px' }}>
                    <button
                        className="btn btn-primary btn-sm bi bi-caret-left-square"
                        id='command'
                        onClick={() => setCurPage(1)}
                        disabled={curPage === 1}
                    ></button>
                    <button
                        className="btn btn-primary btn-sm bi bi-caret-left"
                        id='command'
                        onClick={() => curPage > 1 && setCurPage(curPage - 1)}
                        disabled={curPage === 1}
                    ></button>
                    <span className="received-space">{curPage} / {numPages}</span>
                    <button
                        className="btn btn-primary btn-sm bi bi-caret-right"
                        onClick={() => curPage < numPages && setCurPage(curPage + 1)}
                        id='command'
                        disabled={curPage === numPages}
                    ></button>
                    <button
                        className="btn btn-primary btn-sm bi bi-caret-right-square"
                        id='command'
                        onClick={() => setCurPage(numPages)}
                        disabled={curPage === numPages}
                    ></button>
                </div>
            </div>

            {/* Add Goods Modal */}
            <Modal show={addGoods} onHide={hideAddGoods}>
                <Modal.Header closeButton>  
                    <Modal.Title>เพิ่มรายการสินค้า</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>หมายเลขพัสดุ</Form.Label>
                            <Form.Control
                                type="text"
                                disabled
                                value ={trackingNumber}  // ใช้หมายเลขสุ่มที่เก็บใน state
                                ref={newIdRef}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>ชื่อสินค้า</Form.Label>
                            <Form.Select ref={newNameRef}>
                                <option value="พัสดุแบบกล่องขนาดใหญ่">พัสดุแบบกล่องขนาดใหญ่</option>
                                <option value="พัสดุแบบกล่องขนาดกลาง">พัสดุแบบกล่องขนาดกลาง</option>
                                <option value="พัสดุแบบกล่องขนาดเล็ก">พัสดุแบบกล่องขนาดเล็ก</option>
                                <option value="พัสดุแบบซองขนาดใหญ่">พัสดุแบบซองขนาดใหญ่</option>
                                <option value="พัสดุแบบซองขนาดกลาง">พัสดุแบบซองขนาดกลาง</option>
                                <option value="พัสดุแบบซองขนาดเล็ก">พัสดุแบบซองขนาดเล็ก</option>
                            </Form.Select>
                            <Form.Select ref={newTypeRef}>
                                <option value="ปกติ">ปกติ</option>
                                <option value="แตกหักง่าย">แตกหักง่าย</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => {
                        const id = newIdRef.current.value;
                        const name = newNameRef.current.value;
                        const type = newTypeRef.current.value;
                        addClick(id, name, type);
                    }}>ยืนยัน</Button>
                    <Button variant="danger" onClick={hideAddGoods}>ยกเลิก</Button>
                </Modal.Footer>
            </Modal>

            {/* Details Modal */}
            <Modal show={details} onHide={hideDetails}>
                <Modal.Header closeButton>
                    <Modal.Title>แก้ไขรายการสินค้า</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>หมายเลขพัสดุ</Form.Label>
                            <Form.Control type="text" disabled ref={newIdRef} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>ชื่อสินค้า</Form.Label>
                            <Form.Select ref={newNameRef} defaultValue="">
                                <option value="พัสดุแบบกล่องขนาดใหญ่">พัสดุแบบกล่องขนาดใหญ่</option>
                                <option value="พัสดุแบบกล่องขนาดกลาง">พัสดุแบบกล่องขนาดกลาง</option>
                                <option value="พัสดุแบบกล่องขนาดเล็ก">พัสดุแบบกล่องขนาดเล็ก</option>
                                <option value="พัสดุแบบซองขนาดใหญ่">พัสดุแบบซองขนาดใหญ่</option>
                                <option value="พัสดุแบบซองขนาดกลาง">พัสดุแบบซองขนาดกลาง</option>
                                <option value="พัสดุแบบซองขนาดเล็ก">พัสดุแบบซองขนาดเล็ก</option>
                            </Form.Select>
                            <Form.Select ref={newTypeRef} defaultValue="">
                                <option value="ปกติ">ปกติ</option>
                                <option value="แตกหักง่าย">แตกหักง่าย</option>
                            </Form.Select>

                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => {
                        const id = newIdRef.current.value;
                        const productName = newNameRef.current.value;
                        const productType = newTypeRef.current.value;
                        editClick(id, productName, productType);
                    }}>ยืนยัน</Button>
                    <Button variant="danger" onClick={hideDetails}>ยกเลิก</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ImportGoods;
