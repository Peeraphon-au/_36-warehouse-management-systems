import './ExportGoods.css'
import { useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const initproductPerPages = 10;

function ExportGoods({ product, setproduct, withdraw, setWithdraw }) {
    const improtperpageref = useRef();
    const [productRaw, setproductRaw] = useState([]);
    const [productPerPages, setproductPerPages] = useState(10);
    const [numPages, setNumPages] = useState(0);
    const [curPage, setCurPage] = useState(0);
    const productPerPagesRef = useRef();
    const [ExportGoods, setExportGoods] = useState(false);
    const [selectExport, setSelectExport] = useState(null);

    const showExportGoods = (product) => {
        setSelectExport(product);
        setExportGoods(true);
    };

    const hideExportGoods = () => {
        setExportGoods(false);
    };

    const handleExport = (statuses) => {
        const updatedProducts = productRaw.map(item =>
            item.id === selectExport.id ? { ...item, status: 'รอการอนุมัติ', statusses: 'ถูกเบิก' } : item
        );
        setproductRaw(updatedProducts);
        // เพิ่มสินค้าใหม่เข้าไปใน withdraw
        const exportedItem = updatedProducts.find(item => item.id === selectExport.id);
        if (statuses === 'เบิกแล้ว') {
            setWithdraw((prevWithdraw) => {
                // ดึงวันที่ปัจจุบัน
                const currentDate = new Date().toLocaleDateString('th-TH'); // แสดงวันที่ในรูปแบบไทย
                const updatedWithdraw = [...prevWithdraw, { ...exportedItem, date: currentDate }];
                console.log("เพิ่มเข้าสู่ withdraw:", updatedWithdraw);
                return updatedWithdraw;
            });
        }
        // ลบสินค้าออกจาก product หลังจากที่เบิก
        const updatedProductList = product.filter(item => item.id !== selectExport.id);
        setproduct(updatedProductList); // อัพเดต state ของ product
        console.log("Updated product list:", updatedProductList);


        // ลบสินค้าจาก productRaw เพื่อให้ข้อมูลใน productRaw ตรงกับข้อมูลใหม่ใน product
        const updatedProductRawList = productRaw.filter(item => item.id !== selectExport.id);
        setproductRaw(updatedProductRawList);
        console.log("Updated productRaw list:", updatedProductRawList);

        hideExportGoods(); // ปิด Modal หลังจากกดยืนยัน
    };





    useEffect(() => {
        if (numPages <= 0) setCurPage(0);
        else if (curPage === 0) setCurPage(1);
        else if (curPage > numPages) setCurPage(numPages);
    }, [numPages]);

    useEffect(() => {
        setproductRaw(product);
        setproductPerPages(initproductPerPages);
        productPerPagesRef.current.value = initproductPerPages;
    }, []);

    useEffect(() => {
        setNumPages(Math.ceil(productRaw.length / productPerPages));
    }, [productPerPages, productRaw]);

    useEffect(() => {
        setproductRaw(product);
        setCurPage(1);
    }, []);

    useEffect(() => {
        setproduct(productRaw);
    }, [productRaw, productPerPages]);



    return (
        <div>
            <h1 style={{ textAlign: 'center'}}>เบิกสินค้าออก</h1>
            <div className='container'>
                <div className='showItems1'>
                    <select
                        className="form-select"
                        aria-label="Default select example"
                        defaultValue={10}
                        style={{ width: '150px' }}
                        onChange={(e) => setproductPerPages(e.target.value)}
                        ref={productPerPagesRef}
                    >
                        <option value={5}>5 per page</option>
                        <option value={10}>10 per page</option>
                        <option value={50}>50 per page</option>
                        <option value={100}>100 per page</option>
                    </select>
                </div>
                <table className='table'>
                    <thead>
                        <tr>
                            <th id='table' className='headerTable' style={{textAlign: 'center'}}>รหัส</th>
                            <th id='table' className='headerTable' style={{textAlign: 'center'}}>รายการ</th>
                            <th id='table' className='headerTable' style={{textAlign: 'center'}}>สถานะ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            product.filter((product, index) => {
                                const min = (curPage - 1) * productPerPages;
                                const max = (curPage * productPerPages) - 1;
                                return index >= min && index <= max;
                            })
                                .map((product) => {
                                    return (
                                        <tr key={product.id}>
                                            <td valign='middle' id='table' style={{ width: '6rem',textAlign: 'center' }}>
                                                <span className='badge bg-secondary'>{product.id}</span>
                                            </td>
                                            <td style={{ textAlign: 'left' }} valign='middle' id='table'>
                                                {product.productname}
                                            </td>
                                            <td style={{ textAlign: 'center',width : '8rem' }} valign='middle' id='table'>
                                                {product.statuses === "รอการเบิก" && (
                                                    <button
                                                        style={{ width: '5rem' }}
                                                        className='btn btn-primary'
                                                        onClick={() => showExportGoods(product)}
                                                    >
                                                        เบิก
                                                    </button>
                                                )}
                                                {product.statuses === "เบิกแล้ว" && (
                                                    <button style={{ width: '5rem' }} className='btn btn-danger'>
                                                        เบิกแล้ว
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                        }
                    </tbody>
                </table>
                <div className='command' style={{ textAlign: 'center' }}>
                    <button
                        class={"btn btn-primary btn-sm" + "bi bi-caret-left-square"}
                        id='command'
                        onClick={() => setCurPage(1)}
                        disabled={curPage === 1}
                    ></button>
                    <button
                        class={"btn btn-primary btn-sm" + "bi bi-caret-left"}
                        id='command'
                        onClick={() => curPage > 1 && setCurPage(curPage - 1)}
                        disabled={curPage === 1}
                    ></button>
                    <span className='product-space'>{curPage}&nbsp;/&nbsp;{numPages}</span>
                    <button
                        class={"btn btn-primary btn-sm" + "bi bi-caret-right"}
                        id='command'
                        onClick={() => curPage < numPages && setCurPage(curPage + 1)}
                        disabled={curPage === numPages}
                    ></button>
                    <button
                        class={"btn btn-primary btn-sm" + "bi bi-caret-right-square"}
                        id='command'
                        onClick={() => setCurPage(numPages)}
                        disabled={curPage === numPages}
                    ></button>
                </div>
                <div className="modal show" style={{ display: 'block', position: 'initial' }}>
                    <Modal show={ExportGoods} onHide={hideExportGoods}>
                        <Modal.Header>
                            <Modal.Title>
                                <div><span>ยืนยันการเบิกสินค้าออก</span></div>
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Footer>
                            <Button variant="success" onClick={() => handleExport('เบิกแล้ว')}>ยืนยัน</Button>
                            <Button variant="danger" onClick={hideExportGoods}>ยกเลิก</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    );
}

export default ExportGoods;
