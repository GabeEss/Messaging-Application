import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { makeAuthenticatedRequest } from "../utils/makeAuthRequest";
import { useAuth0 } from '@auth0/auth0-react';

function FriendPage() {
    const [friends, setFriends] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const {
        isAuthenticated,
        getAccessTokenSilently
    } = useAuth0();

    useEffect(() => {
        const renderFriends = async () => {
            setIsLoading(true);
            await getFriends();
            setIsLoading(false);
        };

        renderFriends();
    }, []);

    const getFriends = async () => {
        if (isAuthenticated) {
            try {
                const response = await makeAuthenticatedRequest(
                    getAccessTokenSilently,
                    'get',
                    `${import.meta.env.VITE_API_URL}/user/friends`
                );
                if(response.data.success === true) {
                    setFriends(response.data.friends);
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.log(error.response.data.message);
                } else {
                    console.log(error.message);
                }
            }
        }
    }

    const handleFriend = async () => {
        navigate('/friend-form');
    }

    if(isLoading) return (<p>Loading...</p>);

    return (
        <div>
            <h1>Friend Page</h1>
            <div>
            {
                friends && friends.length === 0 ? <p>No friends found</p> 
                : friends.map((friend) => {
                    return (
                        <div key={friend._id}>
                        <p>{friend.username}</p>
                        </div>
                    )
                })
            }
            </div>
            <div>
                <button onClick={handleFriend}>Add/Remove Friend</button>
            </div>
        </div>
    )
}

export default FriendPage;