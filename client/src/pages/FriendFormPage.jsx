import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { makeAuthenticatedRequest } from "../utils/makeAuthRequest";
import { useAuth0 } from '@auth0/auth0-react';

function FriendForm() {
    const [username, setUsername] = useState('');
    const [action, setAction] = useState('add'); // add or remove friend
    const navigate = useNavigate();

    const {
        isAuthenticated,
        getAccessTokenSilently,
        user
    } = useAuth0();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    }

    const handleFriend = async () => {
        if(isAuthenticated) {
            try {
                const response = await makeAuthenticatedRequest(
                    getAccessTokenSilently,
                    'put',
                    `${import.meta.env.VITE_API_URL}/user/friends/${action}`,
                    { username, user },
                    { username, user }
                );
                if(response.data.success === true) {
                    navigate('/user/friends');
                }
            } catch (error) {
                console.log(error.response.data.message);
            }
        }
    }

    // Handle adding or removing a friend
    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleFriend();
    };

    return (
        <div className='friend-form-page section'>
            <h1 className='form-heading'>Add/Remove Friend</h1>
            <form className='friend-form' onSubmit={handleSubmit}>
                <label className='username-label' htmlFor="username">Username (email)</label>
                <input 
                    className='username-input'
                    type="text"
                    id="username"
                    value={username}
                    onChange={handleUsernameChange}
                    maxLength={64}
                />
                <div className='action-section'>
                    <input
                        className='action-input'
                        type="radio"
                        id="add"
                        name="action"
                        value="add"
                        checked={action==='add'}
                        onChange={(e) => setAction(e.target.value)}
                    />
                    <label className='action-label' htmlFor="add">Add</label>
                    <input 
                        className='action-input'
                        type="radio"
                        id="remove"
                        name="action"
                        value="remove"
                        checked={action === 'remove'}
                        onChange={(e) => setAction(e.target.value)}
                    />
                <label className='action-label' htmlFor="remove">Remove Friend</label>
                </div>
                <button className='confirm-button' type="submit">Confirm</button>
            </form>
        </div>
    )
}

export default FriendForm;