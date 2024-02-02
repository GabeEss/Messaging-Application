import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { makeAuthenticatedRequest } from '../utils/makeAuthRequest';
// import { Link } from 'react-router-dom';
import axios from 'axios';

function HomePage() {
    const {
        loginWithPopup,
        logout,
        isAuthenticated,
        user,
        getAccessTokenSilently
    } = useAuth0();

    const navigate = useNavigate();

    const callApi = () => {
        axios.get(`${import.meta.env.VITE_API_URL}`)
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    
    const callProtectedApi = async () => {
        try {
            const response = await makeAuthenticatedRequest(
                getAccessTokenSilently,
                'get',
                `${import.meta.env.VITE_API_URL}/protected`
            );
            console.log(response.data);
        } catch (error) {
            console.log(error.message);
        }
    }

    const popupAndRegister = () => {
        loginWithPopup().then(() => {
            console.log('logged in');
        }).then(async () => {
            try {
                const response = await makeAuthenticatedRequest(
                    getAccessTokenSilently,
                    'post',
                    `${import.meta.env.VITE_API_URL}/user/register`
                );
                if (response.data.success === true) {
                    console.log('User registered');
                }
            } catch (error) {
                if (error.response && error.response.status === 409) {
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
        if (isAuthenticated) {
            try {
                const response = await makeAuthenticatedRequest(
                    getAccessTokenSilently,
                    'get',
                    `${import.meta.env.VITE_API_URL}/user/getid`
                );
                if (response.data.success === true) {
                    const id = response.data.id;
                    navigate(`/user/${id}/friends`);
                }
            } catch (error) {
                if (error.response && error.response.status === 409) {
                    console.log(error.response.data.message);
                } else {
                    console.log(error.message);
                }
            }
        }
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
                <button>Conversations</button>
            </>
            ) : (
            <div>
                <button onClick={popupAndRegister}>Login / Signup with Popup</button>
            </div>
        ) }
      </div>
      <div>
        <ul>
            <li><button onClick={callApi}>Call API Route</button></li>
            <li><button onClick={callProtectedApi}>Call Protected Route</button></li>
        </ul>
      </div>
    </div>
  );
}

export default HomePage;