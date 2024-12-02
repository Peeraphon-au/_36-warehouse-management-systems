import './ManageUsers.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';

function ManageUsers() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    // ฟังก์ชันในการล้างการกรอก
    const eraseClick = () => {
        setUsername('');
        setPassword('');
        setName('');
    };

    return (
        <div>
            <h1>จัดการบัญชี</h1>
            <div className="container">
                <div className='section'>
                    <span><h4>การแก้ไขข้อมูลบัญชี</h4></span>
                </div>
                <div className='box-from'>
                    <table className='table2'>
                        <tr className='usernameBox'>
                            <td>Username</td>
                            <td> : </td>
                            <td><input type="text" id='username' value={username}
                                onChange={(e) => setUsername(e.target.value)} /></td>
                        </tr>
                        <tr className='passwordBox'>
                            <td>Password</td>
                            <td> : </td>
                            <td><input type="text" id='password' value={password} 
                                onChange={(e) => setPassword(e.target.value)}/></td>
                        </tr>
                        <tr className='nameBox'>
                            <td>Name</td>
                            <td> : </td>
                            <td><input type="text" value={name} 
                                onChange={(e) => setName(e.target.value)}/></td>
                        </tr>
                    </table>
                </div>
                <div>
                    <button id='command' className={"btn btn-success "} onClick={handleShow}>ยืนยัน</button>
                    {/* เรียก eraseClick เป็นฟังก์ชันไม่ใช่การเรียกใช้ */}
                    <button id='command' className={"btn btn-danger "} onClick={eraseClick}>ยกเลิก</button>
                </div>
            </div>
            <div>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>การยืนยันการเปลี่ยนแปลง</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>คุณแน่ใจหรือไม่</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            ยกเลิก
                        </Button>
                        <Button variant="primary" onClick={handleClose}>
                            ตกลง
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}

export default ManageUsers;
