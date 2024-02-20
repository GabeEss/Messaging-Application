import { useEffect } from 'react';
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
                if (error.response && error.response.status === 401) {
                    console.log(error.response.data.message);
                } else {
                    console.log(error.message);
                }
            }
        }).catch((error) => {
            console.error('error', error);
        });
    }

    useEffect(() => {
        if(isAuthenticated) {
            navigate('/home');
        }
    }, [isAuthenticated]);

    const handleHome = () => {
        if(isAuthenticated)
            navigate('/home');
    }

    return(
        <div>
            {!isAuthenticated ? 
                <div>
                    <h1>Login Page</h1>
                    <button onClick={popupAndRegister}>Login</button>
                </div>
            : 
                <div>
                    <h1>Welcome to Messaging Application!</h1>
                    <button onClick={handleHome}>Go to home page</button>
                    <button onClick={() => logout({ returnTo: window.location.origin })}>
                    Log out
                    </button>
                </div>
            }            
        </div>
    )
}

export default LoginPage;
