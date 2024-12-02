import { useRef, useState } from 'react';
import { verifyUser } from "../../data/user";
import './Login.css';
import ImgLogin from '../../../public/Cartoon-cc.jpg';

function Login({ setToken, setRole }) {
    const userRef = useRef();
    const passRef = useRef();
    const [isModalOpen, setIsModalOpen] = useState(false); // สถานะสำหรับ Sign Up Modal
    const [isForgotModalOpen, setIsForgotModalOpen] = useState(false); // สถานะสำหรับ Forgot Password Modal

    const handleSignUpClick = () => setIsModalOpen(true); // เปิด Sign Up Modal
    const handleCloseModal = () => setIsModalOpen(false); // ปิด Sign Up Modal

    const handleForgotPasswordClick = () => setIsForgotModalOpen(true); // เปิด Forgot Password Modal
    const handleCloseForgotModal = () => setIsForgotModalOpen(false); // ปิด Forgot Password Modal

    return (
        <div className="login-container">
            <div className="container-img">
                <img src={ImgLogin} className="App-logo" alt="logo" />
            </div>
            <div className="content">
                <h2 className="from-title">Log in</h2>
                <p className="separator">
                    <span>
                        <i style={{ color: "#473366", fontSize: "1.5rem" }} className="bi bi-person-circle"></i>
                    </span>
                </p>

                <form action="#" className="login-form">
                    <div className="input-wrapper">
                        <input
                            type="text"
                            placeholder="Email address"
                            id="username"
                            className="input-field"
                            ref={userRef}
                            required
                        />
                        <i className="material-symbols-rounded">mail</i>
                    </div>

                    <div className="input-wrapper">
                        <input
                            type="password"
                            placeholder="Password"
                            id="password"
                            className="input-field"
                            ref={passRef}
                            required
                        />
                        <i className="material-symbols-outlined">lock</i>
                    </div>
                    <a href="#" className="forgot-pass-link" onClick={handleForgotPasswordClick}>
                        Forgot Password?
                    </a>

                    <button
                        className="login-button"
                        type="button"
                        onClick={() => {
                            const username = userRef.current.value.trim();
                            const password = passRef.current.value.trim();
                            userRef.current.value = '';
                            passRef.current.value = '';
                            const userInfo = verifyUser(username, password);
                            if (userInfo === null) {
                                alert('Wrong username or password');
                                userRef.current.focus();
                            } else {
                                setToken(userInfo.token);
                                setRole(userInfo.role);
                            }
                        }}
                    >
                        Log in
                    </button>
                </form>

                <p className="signup-text">
                    Don&apos;t have an account?{' '}
                    <a href="#" onClick={handleSignUpClick}>
                        Sign up now
                    </a>
                </p>
            </div>

            {/* Modal สำหรับ Sign Up */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close-button" onClick={handleCloseModal}>
                            &times;
                        </span>
                        <h2>Sign Up</h2>
                        <form>
                            <div className="input-wrapper">
                                <input type="text" placeholder="Enter username" className="input-field" required />
                                <i className="material-symbols-rounded"></i>
                            </div>
                            <div className="input-wrapper">
                                <input type="email" placeholder="Enter email" className="input-field" required />
                                <i className="material-symbols-rounded"></i>
                            </div>
                            <div className="input-wrapper">
                                <input type="password" placeholder="Enter password" className="input-field" required />
                                <i className="material-symbols-rounded"></i>
                            </div>
                            <div className="input-wrapper">
                                <input type="password" placeholder="Confirm password" className="input-field" required />
                                <i className="material-symbols-rounded"></i>
                            </div>
                            <button type="submit" className="signup-button">Sign Up</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal สำหรับ Forgot Password */}
            {isForgotModalOpen && (
                <div className="modal-overlay" onClick={handleCloseForgotModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close-button" onClick={handleCloseForgotModal}>
                            &times;
                        </span>
                        <h2>Forgot Password</h2>
                        <form>
                            <div className="input-wrapper">
                                <input type="email" placeholder="Enter your email" className="input-field" required />
                                <i className="material-symbols-rounded">mail</i>
                            </div>
                            <button type="submit" className="reset-button">Reset Password</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;
