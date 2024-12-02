import { useState, useEffect, useRef } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form } from 'react-bootstrap';

import { fetchAgency } from '../../../data/Agency';

import './ManageAgency.css';

const initangencyPerpage = 10



function Agency() {
    const [agencyRaw, setAgencyRaw] = useState([]);


    const [angencyPerpage, setangencyPerpage] = useState(0);


    const [agency, setAgency] = useState([]);

    const [numPages, setNumPages] = useState(0)
    const [curPage, setCurPage] = useState(0)

    const angencyPerpageRef = useRef()



    useEffect(() => {
        if (numPages <= 0) setCurPage(0)
        else if (curPage === 0) setCurPage(1)
        else if (curPage > numPages) setCurPage(numPages)
    }, [numPages])


    useEffect(() => {
        setAgencyRaw(fetchAgency());

        setangencyPerpage(initangencyPerpage)
        angencyPerpageRef.current.value = initangencyPerpage
    }, [])


    useEffect(() => {
        console.log(`angencyPerpage: ${angencyPerpage}`)
        setNumPages(Math.ceil(agencyRaw.length / angencyPerpage))
    }, [angencyPerpage, agencyRaw])

    useEffect(() => {
        setAgencyRaw(fetchAgency());
        setCurPage(1)
    }, [])

    useEffect(() => {
        setAgency(agencyRaw)
    }, [agencyRaw, angencyPerpage])

    function deleteClcik(id) {
        setAgencyRaw(agencyRaw.filter((agency) => agency.id !== id))
    }

    function addClick(id, name, tel) {
        const newAgency = {
            id,
            name,
            tel,
            userId: 1,
        }
        setAgencyRaw([...agencyRaw, newAgency])
    }

    function editClick(id, name, tel) {
        // แก้ไขข้อมูลใน state `AgencyRaw`
        setAgencyRaw((prevAgency) =>
            prevAgency.map((agency) =>
                agency.id === Number(id) ? { ...agency, name, tel } : agency
            )
        );
        // Debugging: แสดงข้อมูลหลังการอัปเดต
        console.log(`Updated agency with ID: ${id}`);
        console.log("Edited agency with ID:", id, { name, tel });

    }

    useEffect(() => {
        console.log("Updated agencyRaw:", agencyRaw);
    }, [agencyRaw]); // ติดตามการเปลี่ยนแปลงของ AgencyRaw



    const [showadd, setShowadd] = useState(false);
    const [showedit, setShowedit] = useState(false);

    const newIdRef = useRef()
    const newNameRef = useRef()
    const newTelRef = useRef()

    const handleCloseadd = () => setShowadd(false);
    const handleShowadd = () => setShowadd(true);

    const handleCloseedit = () => setShowedit(false);

    const handleShowedit = (agency) => {
        setShowedit(true);
        setTimeout(() => {
            if (newIdRef.current) newIdRef.current.value = agency.id || '';
            if (newNameRef.current) newNameRef.current.value = agency.name || '';
            if (newTelRef.current) newTelRef.current.value = agency.tel || '';
        }, 0);
    }


    return (
        <div className='agency-container'>
            <h1 style={{ textAlign: 'left' }}>การจัดการหน่วยงาน</h1>
            {/* modal-add */}
            <Modal show={showadd} onHide={handleCloseadd}>

                <Modal.Header closeButton>
                    <Modal.Title><span className='bi bi-plus-lg'>&nbsp;เพิ่มข้อมูลหน่วยงาน</span></Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label className='fw-bold'>จำนวนที่:</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                disabled value={
                                    Number(agencyRaw.reduce((prev, agency) => agency.id > prev ? agency.id : prev
                                        , 0)) + 1
                                }
                                ref={newIdRef}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                            <Form.Label>ชื่อหน่วยงาน:</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                ref={newNameRef}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
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
                        const tel = newTelRef.current.value.trim()
                        if (name === '') {
                            alert('name cannot be empty')
                            newNameRef.current.value = ''
                            newNameRef.current.focus()
                        } else {
                            addClick(id, name, tel)
                            handleCloseadd()
                        }
                    }}>
                        <span className='bi bi-plus-lg'>&nbsp;เพิ่ม</span>
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* modal-edit */}
            <Modal show={showedit} onHide={handleCloseedit}>

                <Modal.Header closeButton>
                    <Modal.Title><span className='bi bi-plus-lg'>&nbsp;แก้ไขข้อมูลหน่วยงาน</span></Modal.Title>
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
                            <Form.Label>ชื่อหน่วยงาน:</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                ref={newNameRef}
                            />
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
                        const tel = newTelRef.current?.value.trim();

                        if (!name) {
                            alert('Name cannot be empty');
                            newNameRef.current?.focus();
                            return;
                        }

                        // เรียก `editClick` พร้อมข้อมูลที่กรอก
                        editClick(id, name, tel);

                        // ปิด Modal หลังจากแก้ไขเสร็จ
                        handleCloseedit();
                    }}>
                        <span className='bi bi-plus-lg'>&nbsp;แก้ไข</span>
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className='agency-filters-container'>
                <button className='btn btn-primary' onClick={() => handleShowadd()}>
                    <span className='bg-primary add'>เพิ่มรายการ</span>
                </button>
                <select className="form-select" aria-label="Default select example" defaultValue={10} style={{ width: '200px' }} onChange={(e) => setangencyPerpage(e.target.value)}
                    ref={angencyPerpageRef}
                >
                    <option value={5}>5 agency per page</option>
                    <option value={10} selected>10 agency per page</option>
                    <option value={50}>50 agency per page</option>
                    <option value={100}>100 agency per page</option>
                </select>
            </div>

            <table className='table table-striped'>
                <thead className='table-dark'>
                    <tr>
                        <th style={{ width: '5%' }} valign='middle'>จำนวนที่</th>
                        <th valign='middle'>ชื่อหน่วยงาน</th>
                        <th>เบอร์ติดต่อ</th>
                        <th>แก้ไข</th>
                        <th style={{ textAlign: 'right', width: '20%' }} valign='middle'>ลบ</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        agency.filter((agency, index) => {
                            const min = (curPage - 1) * angencyPerpage
                            const max = (curPage * angencyPerpage) - 1
                            return index >= min && index <= max
                        })
                            .map((agency) => {
                                return (
                                    <tr key={agency.id}>
                                        <td valign='middle'><span className='badge bg-secondary' style={{ width: '3rem' }}>{agency.id}</span></td>
                                        <td style={{ textAlign: 'center' }} valign='middle'>{agency.name}</td>
                                        <td style={{ textAlign: 'center' }} valign='middle'>{agency.tel}</td>
                                        <td style={{ textAlign: 'center' }} valign='middle'>
                                            <button className='btn btn-primary' onClick={() => handleShowedit(agency)}>
                                                <span className='bi bi-pencil'></span>
                                            </button>
                                        </td>
                                        <td style={{ textAlign: 'right' }} valign='middle'>
                                            <button className='btn btn-danger' onClick={() => deleteClcik(agency.id)}>
                                                <span className='bi bi-trash'></span>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}

                </tbody>
            </table>

            <div className='pagebar' style={{ padding: '1rem' }}>
                <button className='btn btn-outline-primary agency-space'
                    onClick={() => setCurPage(1)} disabled={curPage === 1}>First</button>
                <button className='btn btn-outline-primary agency-space'
                    onClick={() => curPage > 1 && setCurPage(curPage - 1)} disabled={curPage === 1}>Previous</button>
                <span className='agency-space'>{curPage}&nbsp;/&nbsp;{numPages}</span>
                <button className='btn btn-outline-primary agency-space'
                    onClick={() => curPage < numPages && setCurPage(curPage + 1)} disabled={curPage === numPages}>Next</button>
                <button className='btn btn-outline-primary agency-space'
                    onClick={() => setCurPage(numPages)} disabled={curPage === numPages}>Last</button>
            </div>
        </div >
    );
}

export default Agency;