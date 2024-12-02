import './ManageUser.css'

function ManageUsers() {
    return (
        <div>
            <h1>จัดการบัญชี</h1>
            <div className="container">
                <div className='section'>
                    <span><h4>ฟอร์มการแก้ไขข้อมูลบัญชี</h4></span>
                </div>
                <div className='box-from'>
                    <table className='table2'>
                        <tr>
                            <td>Username</td>
                            <td> : </td>
                            <td><input type="text" /></td>
                        </tr>
                        <tr>
                            <td>Password</td>
                            <td> : </td>
                            <td><input type="text" /></td>
                        </tr>
                        <tr>
                            <td>Name</td>
                            <td> : </td>
                            <td><input type="text" /></td>
                        </tr>
                        <tr>
                            <td>Tel.</td>
                            <td> : </td>
                            <td><input type="text" /></td>
                        </tr>
                    </table>
                </div>
                <div>
                    <button id='command' class={"btn btn-success " }>ยืนยัน</button>
                    <button id='command' class={"btn btn-danger " }>ยกเลิก</button>
                </div>
            </div>
        </div>
    );
}

export default ManageUsers;