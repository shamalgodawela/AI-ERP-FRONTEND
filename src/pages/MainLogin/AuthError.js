import { Link } from "react-router-dom"
import "./AuthError.css"

const AuthError = () => {
    return (
        <div className="auth-error-container">
            <div className="auth-error-card">
                <div className="error-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                    </svg>
                </div>
                <h1 className="error-title">Authentication Error</h1>
                <p className="error-message">
                    Sorry, you don't have permission to access this page. 
                    Please log in with valid credentials.
                </p>
                <div className="error-actions">
                    <Link to="/" className="home-button">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor"/>
                        </svg>
                        Go to Home
                    </Link>
                    <Link to="/login" className="login-button">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z" fill="currentColor"/>
                        </svg>
                        Login
                    </Link>
                </div>
                <div className="error-code">
                    Error Code: 401
                </div>
            </div>
        </div>
    )
}

export default AuthError;