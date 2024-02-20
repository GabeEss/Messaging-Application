import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { makeAuthenticatedRequest } from '../utils/makeAuthRequest';

function HomePage() {
    const [userMongo, setUserMongo] = useState({});
    const {
        logout,
        isAuthenticated,
        user,
        getAccessTokenSilently,
        isLoading
    } = useAuth0();

    const navigate = useNavigate();

    const goToFriends = async () => {
        navigate('/user/friends');
    }

    const goToConvos = async () => {
        navigate('/convos');
    }

    const goToUserOptions = async () => {
        navigate('/user');
    }

    const getUser = async () => {
        try {
            const response = await makeAuthenticatedRequest(
                getAccessTokenSilently,
                'get',
                `${import.meta.env.VITE_API_URL}/user`,
                {},
                { user }
            );
            if(response.data.success === true) {
                setUserMongo(response.data.user);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log(error.response.data.message);
            } else {
                console.log(error.message);
            }
        }
    }

    useEffect(() => {
        if(isAuthenticated) {
            getUser();
        }
    }, [isAuthenticated]);


    if(isLoading) return (<p>Loading...</p>);
    
  return (
    <div>
      <h1>Welcome to Messaging Application!</h1>
      <div>
            <h2>{userMongo.username}</h2>
            <div>You are logged in!</div>
            <button onClick={() => logout({ returnTo: window.location.origin })}>
            Log out
            </button>
            <button onClick={goToFriends}>Friends List</button>
            <button onClick={goToConvos}>Conversations</button>
            <button onClick={goToUserOptions}>User Options</button>
      </div>
    </div>
  );
}

export default HomePage;