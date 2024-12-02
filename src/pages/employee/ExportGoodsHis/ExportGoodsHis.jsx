import './ExportGoodsHis.css'
import { useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const initreceivedPerPages = 10
function ExportGoodsHis( {withdraw, setWithdraw}) {

    const improtperpageref = useRef()
    const [receivedRaw, setReceivedRaw] = useState([]);

    const [receivedPerPages, setReceivedPerPages] = useState(10);

    const [received, setReceived] = useState([]);

    const [numPages, setNumPages] = useState(0)
    const [curPage, setCurPage] = useState(0)

    const receivedPerPagesRef = useRef()

    const [Details, setDetails] = useState(false);
    const showDetails = () => { setDetails(true) }
    const hideDetails = () => { setDetails(false) }

    useEffect(() => {
        if (numPages <= 0) setCurPage(0)
        else if (curPage === 0) setCurPage(1)
        else if (curPage > numPages) setCurPage(numPages)
    }, [numPages])


    useEffect(() => {
        setReceivedRaw(withdraw);

        setReceivedPerPages(initreceivedPerPages)
        receivedPerPagesRef.current.value = initreceivedPerPages
    }, [])


    useEffect(() => {
        console.log(`receivedPerPages: ${receivedPerPages}`)
        setNumPages(Math.ceil(receivedRaw.length / receivedPerPages))
    }, [receivedPerPages, receivedRaw])

    useEffect(() => {
        setReceivedRaw(withdraw);
        setCurPage(1)
    }, [])

    useEffect(() => {
        setReceived(receivedRaw)
    }, [receivedRaw, receivedPerPages])

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>ประวัติเบิกสินค้า</h1>
            <div className="container">
                <div className='showItems1'>
                    {/* <div>
                        <button>เปิดปิด</button>
                        <span>show only</span>
                        <button>สถานะ</button>
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
                            <th className='headerTable' id='table' style={{ textAlign: 'center' }}>รหัส</th>
                            <th className='headerTable' id='table' style={{ textAlign: 'center',width:'8rem'}}>วันที่</th>
                            <th className='headerTable' id='table' style={{ textAlign: 'center' }}>รายการ</th>
                            <th className='headerTable' id='table' style={{ textAlign: 'center',width:'7rem' }}>ผู้อนุมัติ</th>
                            <th className='headerTable' id='table' style={{ textAlign: 'center',width:'7rem' }}>สถานะ</th>
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
                                            <td valign='middle' id='table' style={{ width: '3rem' }}><span className='badge bg-secondary' style={{ width: '4rem' }}>{received.id}</span></td>
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

                    {/* <tr>
                        <td id='table'>1</td>
                        <td id='table'>1/1/1</td>
                        <td className='listname' id='table'>พัสดุแบบซอง</td>
                        <td id='table'>ชื่อผู้อนุมัติ</td>
                        <td id='table'>กําลังดําเนินการ</td>
                        <td id='table'><button class={"btn btn-primary btn-sm" + "bi bi-info-circle"}></button></td>
                    </tr>
                    <tr>
                        <td id='table'>2</td>
                        <td id='table'>1/1/1</td>
                        <td className='listname' id='table'>พัสดุแบบขนาดเล็ก</td>
                        <td id='table'>ชื่อผู้อนุมัติ</td>
                        <td id='table'>กําลังดําเนินการ</td>
                        <td id='table'><button class={"btn btn-primary btn-sm" + "bi bi-info-circle"}></button></td>
                    </tr> */}
                </table>
                <div className='showcommand'>
                    <button class={"btn btn-primary btn-sm" + "bi bi-caret-left-square"} id='command'
                        onClick={() => setCurPage(1)} disabled={curPage === 1}></button>
                    <button class={"btn btn-primary btn-sm" + "bi bi-caret-left"} id='command'
                        onClick={() => curPage > 1 && setCurPage(curPage - 1)} disabled={curPage === 1}></button>
                    <span className='received-space'>{curPage}&nbsp;/&nbsp;{numPages}</span>
                    <button class={"btn btn-primary btn-sm" + "bi bi-caret-right"} id='command'
                        onClick={() => curPage < numPages && setCurPage(curPage + 1)} disabled={curPage === numPages}></button>
                    <button class={"btn btn-primary btn-sm" + "bi bi-caret-right-square"} id='command'
                        onClick={() => setCurPage(numPages)} disabled={curPage === numPages} ></button>
                </div>
            </div>
        </div>
    );
}

export default ExportGoodsHis;