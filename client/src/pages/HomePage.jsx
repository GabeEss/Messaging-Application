import { useAuth0 } from '@auth0/auth0-react';
import { makeAuthenticatedRequest } from '../utils/makeAuthRequest';
import axios from 'axios';

function HomePage() {
    const {
        loginWithPopup,
        logout,
        isAuthenticated,
        user,
        getAccessTokenSilently
    } = useAuth0();

    const callApi = () => {
        axios.get('http://localhost:3000/')
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
                'http://localhost:3000/protected'
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
                    'http://localhost:3000/user/register'
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
            </>
            ) : (
            <div>
                <button onClick={popupAndRegister}>Login / Signup with Popup</button>
                <button>Friends List</button>
                <button>Conversations</button>
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