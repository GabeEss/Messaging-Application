import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { makeAuthenticatedRequest } from '../utils/makeAuthRequest';

function LoginPage() {
    const {
        loginWithPopup,
        logout,
        isAuthenticated,
        user,
        getAccessTokenSilently
    } = useAuth0();
    const navigate = useNavigate();

    const popupAndRegister = () => {
        loginWithPopup().then(() => {
        }).then(async () => {
            try {
                const response = await makeAuthenticatedRequest(
                    getAccessTokenSilently,
                    'post',
                    `${import.meta.env.VITE_API_URL}/user/register`,
                    {},
                    { user }
                );
                if (response.data.success === true) {
                    console.log('User registered');
                }
            } catch (error) {
                console.log(error.response.data.message);
            }
        }).catch((error) => {
            console.error('error', error);
        });
    }

    const handleHome = () => {
        if(isAuthenticated)
            navigate('/home');
    }

    return(
        <div className='login-page'>
            {!isAuthenticated ? 
                <div className='login-section section'>
                    <h1 className='login-heading'>Messaging Application Login Page</h1>
                    <button className='login-button' onClick={popupAndRegister}>Login</button>
                </div>
            : 
                <div className='welcome-section section'>
                    <h1 className='welcome-heading'>Welcome to Messaging Application!</h1>
                    <button className='home-button' onClick={handleHome}>Go to home page</button>
                    <button className='logout-button' onClick={() => logout({ returnTo: window.location.origin })}>
                    Log out
                    </button>
                </div>
            }            
        </div>
    )
}

export default LoginPage;
