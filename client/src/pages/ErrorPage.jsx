import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const ErrorPage = () => {
    const {
        logout,
        isAuthenticated,
    } = useAuth0();
    const navigate = useNavigate();

    const goToLogin = () => {
        navigate('/');
    }

    const handleLogout = () => {
        logout();
    }

    return (
        <div className="error-page section">
            <h1 className='error-heading'>Error: Not connected to server</h1>
            {isAuthenticated 
            ? <button className='logout-button' onClick={handleLogout}>Logout</button> 
            : <button className='login-button' onClick={goToLogin}>Go to login page.</button>}
        </div>
    );
};

export default ErrorPage;