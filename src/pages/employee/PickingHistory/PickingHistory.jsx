import './PickingHistory.css'
import { useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { fetchReceivedlist } from '../../../data/Received list';
const initreceivedPerPages = 10
function PickingHistory({ received, setReceived }) {
    const [receivedRaw, setReceivedRaw] = useState([]);

    const [receivedPerPages, setReceivedPerPages] = useState(0);

    const [numPages, setNumPages] = useState(0)
    const [curPage, setCurPage] = useState(0)

    const receivedPerPagesRef = useRef()

    const [details, setDetails] = useState(false);
    const showDetails = () => { setDetails(true) }
    const hideDetails = () => { setDetails(false) }

    useEffect(() => {
        if (numPages <= 0) setCurPage(0)
        else if (curPage === 0) setCurPage(1)
        else if (curPage > numPages) setCurPage(numPages)
    }, [numPages])


    useEffect(() => {
        setReceivedRaw(received);

        setReceivedPerPages(initreceivedPerPages)
        receivedPerPagesRef.current.value = initreceivedPerPages
    }, [])


    useEffect(() => {
        console.log(`receivedPerPages: ${receivedPerPages}`)
        setNumPages(Math.ceil(receivedRaw.length / receivedPerPages))
    }, [receivedPerPages, receivedRaw])

    useEffect(() => {
        setReceivedRaw(received);
        setCurPage(1)
    }, [])

    useEffect(() => {
        setReceived(received)
    }, [receivedRaw, receivedPerPages])

    return (
        <div className='pickingHistory-container'>
            <h1>ประวัติรับสินค้า</h1>
            <div className='container'>
                <div className='showItems1'>
                    {/* <div>
                        <button>เปิดปิด</button>
                        <span>show only</span>
                        <span class="badge badge-pill badge-warning">รออนุมัติ</span>
                    </div> */}
                    <div>
                        <select className="form-select" aria-label="Default select example" defaultValue={10} style={{ width: '150px' }} onChange={(e) => setReceivedPerPages(e.target.value)}
                            ref={receivedPerPagesRef}
                        >
                            <option value={5}>5 per page</option>
                            <option value={10}>10 per page</option>
                            <option value={50}>50 per page</option>
                            <option value={100}>100 per page</option>
                        </select>
                    </div>
                </div>
                <table className='tables'>
                    <thead>
                        <tr>
                            <th className='headerTable' id='table' style={{ width: '6rem',textAlign: 'center'}}>รหัส</th>
                            <th className='headerTable' id='table' style={{ width: '7rem',textAlign: 'center'}}>วันที่</th>
                            <th className='headerTable' id='table' style={{textAlign: 'center'}}>รายการ</th>
                            <th className='headerTable' id='table' style={{ width: '7rem',textAlign: 'center'}}>ผู้อนุมัติ</th>
                            <th className='headerTable' id='table' style={{ width: '7rem',textAlign: 'center'}}> สถานะ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            received.filter((received, index) => {
                                const min = (curPage - 1) * receivedPerPages
                                const max = (curPage * receivedPerPages) - 1
                                return index >= min && index <= max
                            })
                                .map((received) => {
                                    return (
                                        <tr key={received.id}>
                                            <td valign='middle' id='table' style={{ width: '6rem',textAlign: 'center' }}><span className='badge bg-secondary' style={{ width: '4rem' }}>{received.id}</span></td>
                                            <td style={{ textAlign: 'center' }} valign='middle' id='table'>{received.date}</td>
                                            <td style={{ textAlign: 'left' }} valign='middle' id='table'>{received.productname}</td>
                                            <td style={{ textAlign: 'center' }} valign='middle' id='table'>
                                            {received.status === "อนุมัติ" && (
                                                <span>ผู้จัดการ</span>
                                                )}
                                                {received.status === "ไม่อนุมัติ" && (
                                                    <span>ผู้จัดการ</span>
                                                )}
                                            </td>
                                            <td style={{ textAlign: 'center' }} valign='middle' id='table'>
                                                {received.status === "อนุมัติ" && (
                                                    <button style={{ width: '3rem' }}
                                                    className='btn btn-success + bi bi-check-circle-fill'>
                                                    </button>
                                                )}
                                                {received.status === "ไม่อนุมัติ" && (
                                                    <button style={{ width: '3rem' }}
                                                    className='btn btn-danger + bi bi-x-circle-fill'>
                                                    </button>
                                                )}
                                                {received.status === "รอการอนุมัติ" && (
                                                    <button style={{ width: '3rem' }}
                                                    className='btn btn-warning + bi bi-hourglass-bottom'>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                        
                                    )
                                })}
                    </tbody>
                </table>
                <div className='command' style={{ marginTop: '2rem'}}>
                    <button class={"btn btn-primary btn-sm" + "bi bi-caret-left-square"} id='command'
                        onClick={() => setCurPage(1)} disabled={curPage === 1}></button>
                    <button class={"btn btn-primary btn-sm" + "bi bi-caret-left"} id='command'
                        onClick={() => curPage > 1 && setCurPage(curPage - 1)} disabled={curPage === 1}></button>
                    <span className='received-space'>{curPage}&nbsp;/&nbsp;{numPages}</span>
                    <button class={"btn btn-primary btn-sm" + "bi bi-caret-right"} id='command'
                        onClick={() => curPage < numPages && setCurPage(curPage + 1)} disabled={curPage === numPages}></button>
                    <button class={"btn btn-primary btn-sm" + "bi bi-caret-right-square"} id='command'
                        onClick={() => setCurPage(numPages)} disabled={curPage === numPages}></button>
                </div>
            </div>

            <div
                className="modal show"
                style={{ display: 'block', position: 'initial' }}
            >
                <Modal show={details} onHide={hideDetails}>
                    <Modal.Header style={{ justifyContent: 'center', textAlign: 'center'}}>
                        <Modal.Title>
                            <div>
                                <div><span>รายการการรับสินค้า</span></div>
                                <div><span>รหัสการรับ ID 001</span></div>
                                <div><span>วันที่รับสินค้า 11/11/24</span></div>
                                <div> <span>4</span></div>
                            </div>
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div className='showItems'>
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <td className='headerTable'>รหัส</td>
                                        <td className='headerTable'>รายการ</td>
                                        <td className='headerTable'>ผู้อนุมัติ</td>
                                        <td className='headerTable'>สถานะ</td>
                                        <td className='headerTable'>จำนวน</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{ textAlign: 'center' }} valign='middle' id='table'>1</td>
                                        <td style={{ textAlign: 'left' }} valign='middle' id='table'>2</td>
                                        <td style={{ textAlign: 'center' }} valign='middle' id='table'>3</td>
                                        <td style={{ textAlign: 'center' }} valign='middle' id='table'>4</td>
                                        <td style={{ textAlign: 'center' }} valign='middle' id='table'>5</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Modal.Body>

                    <Modal.Footer style={{justifyContent: 'center'}}>
                        <Button variant="danger" onClick={hideDetails} >Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}

export default PickingHistory
