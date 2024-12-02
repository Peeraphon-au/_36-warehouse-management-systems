import { useState, useEffect, useRef } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form } from 'react-bootstrap';

import { fetchPersonal } from '../../../data/personal';

import './ManagePersonnel.css';

const initpersonalsPerPage = 10



function Personal() {
    const [personalsRaw, setPersonalsRaw] = useState([]);

    const [personalsPerPage, setpersonalsPerPage] = useState(0);

    const [personals, setPersonals] = useState([]);

    const [numPages, setNumPages] = useState(0)
    const [curPage, setCurPage] = useState(0)

    const personalsPerPageRef = useRef()

    
    useEffect(() => {
        if (numPages <= 0) setCurPage(0)
        else if (curPage === 0) setCurPage(1)
        else if (curPage > numPages) setCurPage(numPages)
    }, [numPages])


    useEffect(() => {
        setPersonalsRaw(fetchPersonal);

        setpersonalsPerPage(initpersonalsPerPage)
        personalsPerPageRef.current.value = initpersonalsPerPage
    }, [])


    useEffect(() => {
        console.log(`personalsPerPage: ${personalsPerPage}`)
        setNumPages(Math.ceil(personalsRaw.length / personalsPerPage));  // คำนวณจำนวนหน้าทุกครั้งที่จำนวนรายการต่อหน้าหรือข้อมูลเปลี่ยนแปลง
    }, [personalsRaw, personalsPerPage]);  // ตรวจสอบการเปลี่ยนแปลงของ personalsRaw และ personalsPerPage

    useEffect(() => {
        setPersonalsRaw(fetchPersonal);
        setCurPage(1)
    }, [])

    useEffect(() => {
        setPersonals(personalsRaw)
    }, [personalsRaw, personalsPerPage])

    function deleteClcik(id) {
        setPersonalsRaw(personalsRaw.filter((personal) => personal.id !== id))
    }

    function addClick(id, name, rank, tel) {
        const newPersonal = {
            id,
            name,
            rank,
            tel,
            userId: 1,
        };
        // เพิ่มข้อมูลใหม่ใน state personalsRaw
        setPersonalsRaw((prevPersonals) => [...prevPersonals, newPersonal]);
        setPersonals((prevPersonals) => [...prevPersonals, newPersonal]);
        handleCloseadd();
    }
    
    function editClick(id, name, rank, tel) {
        // แก้ไขข้อมูลใน state personalsRaw และ personals
        setPersonalsRaw((prevPersonals) =>
            prevPersonals.map((personal) =>
                personal.id === Number(id) ? { ...personal, name, rank, tel } : personal
            )
        );
        setPersonals((prevPersonals) =>
            prevPersonals.map((personal) =>
                personal.id === Number(id) ? { ...personal, name, rank, tel } : personal
            )
        );
        console.log(`Updated person with ID: ${id}`);
        console.log("Edited personal with ID:", id, { name, rank, tel });
    }

    useEffect(() => {
        console.log("Updated personalsRaw:", personalsRaw);
    }, [personalsRaw]); // ติดตามการเปลี่ยนแปลงของ personalsRaw

    // function editClick(id, name, rank, tel) {
    //     // แก้ไขข้อมูลใน state `personalsRaw`
    //     setPersonalsRaw((prevPersonals) =>
    //         prevPersonals.map((personal) =>
    //             personal.id === Number(id) ? { ...personal, name, rank, tel } : personal
    //         )
    //     );
    //     // Debugging: แสดงข้อมูลหลังการอัปเดต
    //     console.log(`Updated person with ID: ${id}`);
    //     console.log("Edited personal with ID:", id, { name, rank, tel });

    // }

    const [showadd, setShowadd] = useState(false);
    const [showedit, setShowedit] = useState(false);

    const newIdRef = useRef()
    const newNameRef = useRef()
    const newRankRef = useRef()
    const newTelRef = useRef()

    const handleCloseadd = () => setShowadd(false);
    const handleShowadd = () => setShowadd(true);

    const handleCloseedit = () => setShowedit(false);
    const handleShowedit = (personal) => {
        setShowedit(true);
        setTimeout(() => {
            if (newIdRef.current) newIdRef.current.value = personal.id || '';
            if (newNameRef.current) newNameRef.current.value = personal.name || '';
            if (newRankRef.current) newRankRef.current.value = personal.rank || '';
            if (newTelRef.current) newTelRef.current.value = personal.tel || '';
        }, 0);
    }

    return (
        <div className='personal-container'>
            <h1 style={{ textAlign: 'left'}}>การจัดการบุคลากร</h1>
            {/* modal-add */}
            <Modal show={showadd} onHide={handleCloseadd}>

                <Modal.Header closeButton>
                    <Modal.Title><span className='bi bi-plus-lg'>&nbsp;เพิ่มข้อมูลบุคลากร</span></Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>จำนวน:</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                disabled value={
                                    Number(personalsRaw.reduce((prev, personal) => personal.id > prev ? personal.id : prev
                                        , 0)) + 1
                                }
                                ref={newIdRef}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                            <Form.Label>ชื่อ:</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                ref={newNameRef}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlSelect3">
                            <Form.Label>ตำแหน่ง:</Form.Label>
                            <Form.Select aria-label="Default select example" ref={newRankRef}>
                                <option>โปรดเลือกตำแหน่ง</option>
                                <option value="ผู้จัดการคลังสินค้า">ผู้จัดการคลังสินค้า</option>
                                <option value="ผู้ช่วยผู้จัดการคลังสินค้า">ผู้ช่วยผู้จัดการคลังสินค้า</option>
                                <option value="เจ้าหน้าที่คลังสินค้า">เจ้าหน้าที่คลังสินค้า</option>
                                <option value="ผู้ประสานงานด้านการขนส่ง">ผู้ประสานงานด้านการขนส่ง</option>
                                <option value="เจ้าหน้าที่ขนส่งและจัดส่ง">เจ้าหน้าที่ขนส่งและจัดส่ง</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
                            <Form.Label>เบอร์ติดต่อ:</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                maxLength={10}
                                ref={newTelRef}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseadd}>
                        <span className='bi bi-x-lg'>&nbsp;ยกเลิก</span>
                    </Button>
                    <Button variant="primary" onClick={() => {
                        const id = newIdRef.current.value
                        const name = newNameRef.current.value.trim()
                        const rank = newRankRef.current.value.trim()
                        const tel = newTelRef.current.value.trim()
                        if (name === '') {
                            alert('name cannot be empty')
                            newNameRef.current.value = ''
                            newNameRef.current.focus()
                        } else {
                            addClick(id, name, rank, tel)
                            handleCloseadd()
                        }
                        console.log('Updated personalsRaw:', personalsRaw);
                    }}>
                        <span className='bi bi-plus-lg'>&nbsp;เพิ่ม</span>
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* modal-edit */}
            <Modal show={showedit} onHide={handleCloseedit}>

                <Modal.Header closeButton>
                    <Modal.Title><span className='bi bi-plus-lg'>&nbsp;แก้ไขข้อมูลบุคลากร</span></Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>จำนวนที่:</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                disabled value
                                ref={newIdRef}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                            <Form.Label>ชื่อ:</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                ref={newNameRef}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlSelect3">
                            <Form.Label>ตำแหน่ง:</Form.Label>
                            <Form.Select aria-label="Default select example" ref={newRankRef}>
                                <option>โปรดเลือกตำแหน่ง</option>
                                <option value="ผู้จัดการคลังสินค้า">ผู้จัดการคลังสินค้า</option>
                                <option value="เจ้าหน้าที่คลังสินค้า">เจ้าหน้าที่คลังสินค้า</option>
                                <option value="เจ้าหน้าที่ขนส่งและจัดส่ง">เจ้าหน้าที่ขนส่งและจัดส่ง</option>
                                <option value="ผู้ประสานงานด้านการขนส่ง">ผู้ประสานงานด้านการขนส่ง</option>
                                <option value="ผู้ช่วยผู้จัดการคลังสินค้า">ผู้ช่วยผู้จัดการคลังสินค้า</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
                            <Form.Label>เบอร์ติดต่อ:</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                maxLength={10}
                                ref={newTelRef}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseedit}>
                        <span className='bi bi-x-lg'>&nbsp;ยกเลิก</span>
                    </Button>
                    <Button variant="primary" onClick={() => {
                        const id = newIdRef.current?.value;
                        const name = newNameRef.current?.value.trim();
                        const rank = newRankRef.current?.value.trim();
                        const tel = newTelRef.current?.value.trim();

                        if (!name) {
                            alert('Name cannot be empty');
                            newNameRef.current?.focus();
                            return;
                        }

                        // เรียก `editClick` พร้อมข้อมูลที่กรอก
                        editClick(id, name, rank, tel);

                        // ปิด Modal หลังจากแก้ไขเสร็จ
                        handleCloseedit();
                    }}>
                        <span className='bi bi-plus-lg'>&nbsp;แก้ไข</span>
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className='personal-filters-container'>
                <button className='btn btn-primary' onClick={() => handleShowadd()}>
                    <span className='bg-primary add'>เพิ่มรายการ</span>
                </button>
                <select className="form-select" aria-label="Default select example" defaultValue={10} style={{ width: '200px' }} onChange={(e) => setpersonalsPerPage(e.target.value)}
                    ref={personalsPerPageRef}
                >
                    <option value={5}>5 personals per page</option>
                    <option value={10} selected>10 personals per page</option>
                    <option value={50}>50 personals per page</option>
                    <option value={100}>100 personals per page</option>
                </select>
            </div>

            <table className='table table-striped'>
                <thead className='table-dark'>
                    <tr>
                        <th style={{ width: '5%' }} valign='middle'>จำนวนที่</th>
                        <th valign='middle'>ชื่อ</th>
                        <th>ตำแหน่ง</th>
                        <th>เบอร์ติดต่อ</th>
                        <th>แก้ไข</th>
                        <th style={{ textAlign: 'right', width: '20%' }} valign='middle'>ลบ</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        personals.filter((personal, index) => {
                            const min = (curPage - 1) * personalsPerPage
                            const max = (curPage * personalsPerPage) - 1
                            return index >= min && index <= max
                        })
                            .map((personal) => {
                                return (
                                    <tr key={personal.id}>
                                        <td valign='middle'><span className='badge bg-secondary' style={{ width: '3rem' }}>{personal.id}</span></td>
                                        <td style={{ textAlign: 'center' }} valign='middle'>{personal.name}</td>
                                        <td style={{ textAlign: 'center' }} valign='middle'>{personal.rank}</td>
                                        <td style={{ textAlign: 'center' }} valign='middle'>{personal.tel}</td>
                                        <td style={{ textAlign: 'center' }} valign='middle'>
                                            <button className='btn btn-primary' onClick={() => handleShowedit(personal)}>
                                                <span className='bi bi-pencil'></span>
                                            </button>
                                        </td>
                                        <td style={{ textAlign: 'right' }} valign='middle'>
                                            <button className='btn btn-danger' onClick={() => deleteClcik(personal.id)}>
                                                <span className='bi bi-trash'></span>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}

                </tbody>
            </table>
            <div className='pagebar' style={{ padding: '0.8rem' }}>
                <button className='btn btn-outline-primary personal-space'
                    onClick={() => setCurPage(1)} disabled={curPage === 1}>First</button>
                <button className='btn btn-outline-primary personal-space'
                    onClick={() => curPage > 1 && setCurPage(curPage - 1)} disabled={curPage === 1}>Previous</button>
                <span className='personal-space'>{curPage}&nbsp;/&nbsp;{numPages}</span>
                <button className='btn btn-outline-primary personal-space'
                    onClick={() => curPage < numPages && setCurPage(curPage + 1)} disabled={curPage === numPages}>Next</button>
                <button className='btn btn-outline-primary personal-space'
                    onClick={() => setCurPage(numPages)} disabled={curPage === numPages}>Last</button>
            </div>
        </div >
    );
}

export default Personal;