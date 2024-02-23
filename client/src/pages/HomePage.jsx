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
            console.log(error.response.data.message);
        }
    }

    useEffect(() => {
        if(isAuthenticated) {
            getUser();
        }
    }, [isAuthenticated]);


    if(isLoading) return (<h2 className='loading-heading'>Loading...</h2>);
    
  return (
    <div className='home-page section'>
      <h1 className='home-heading'>Welcome to Messaging Application!</h1>
      <div className='user-section'>
            <h2 className='username'>{`Hello, ${userMongo.username}`}</h2>
            <div className='home-buttons'>
                <button className='logout-button' onClick={() => logout({ returnTo: window.location.origin })}>
                Log out
                </button>
                <button className='friends-button' onClick={goToFriends}>Friends List</button>
                <button className='convos-button' onClick={goToConvos}>Conversations</button>
                <button className='options-button' onClick={goToUserOptions}>User Options</button>
            </div>
      </div>
    </div>
  );
}

export default HomePage;