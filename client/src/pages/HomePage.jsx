import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

function HomePage() {

    const {
        loginWithPopup,
        loginWithRedirect,
        logout,
        isAuthenticated,
        user,
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
    
    const callProtectedApi = () => {
        axios.get('http://localhost:3000/protected')
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
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
                <button onClick={loginWithPopup}>Login / Signup with Popup</button>
                <button onClick={loginWithRedirect}>Login / Signup with Redirect</button>
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