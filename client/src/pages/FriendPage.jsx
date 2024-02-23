import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { makeAuthenticatedRequest } from "../utils/makeAuthRequest";
import { useAuth0 } from '@auth0/auth0-react';

function FriendPage() {
    const [friends, setFriends] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const {
        getAccessTokenSilently,
        user,
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
        try {
            const response = await makeAuthenticatedRequest(
                getAccessTokenSilently,
                'get',
                `${import.meta.env.VITE_API_URL}/user/friends`,
                {},
                { user }
            );
            if(response.data.success === true) {
                setFriends(response.data.friends);
            }
        } catch (error) {
            console.log(error.response.data.message);
        }
    }

    const handleFriend = async () => {
        navigate('/friend-form');
    }

    if(isLoading) return (<h2 className='loading-heading'>Loading...</h2>);

    return (
        <div className='friend-page section'>
            <h1 className='friend-heading'> Friend Page</h1>
            <div className='friend-list'>
            {
                friends && friends.length === 0 ? <p>No friends found</p> 
                : friends.map((friend) => {
                    return (
                        <div key={friend._id}>
                            <p className='friend-item'>{friend.username}</p>
                        </div>
                    )
                })
            }
            </div>
            <div className='friend-actions'>
                <button className='friend-button' onClick={handleFriend}>Add/Remove Friend</button>
            </div>
        </div>
    )
}

export default FriendPage;