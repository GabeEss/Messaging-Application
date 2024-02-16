import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { makeAuthenticatedRequest } from '../utils/makeAuthRequest';

function HomePage() {
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

    const goToFriends = async () => {
        navigate('/user/friends');
    }

    const goToConvos = async () => {
        navigate('/convos');
    }

  return (
    <div>
      <h1>Welcome to Messaging Application!</h1>
      <div>
        {isAuthenticated ? (
            <>
                <div>You are logged in!</div>
                <button onClick={() => logout({ returnTo: window.location.origin })}>
                Log out
                </button>
                <div>
                <img src={user.picture} alt={user.name} />
                <h2>{user.name}</h2>
                <p>{user.email}</p>
                </div>
                <button onClick={goToFriends}>Friends List</button>
                <button onClick={goToConvos}>Conversations</button>
            </>
            ) : (
            <div>
                <button onClick={popupAndRegister}>Login / Signup with Popup</button>
            </div>
        ) }
      </div>
    </div>
  );
}

export default HomePage;