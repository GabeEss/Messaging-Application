import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { makeAuthenticatedRequest } from "../utils/makeAuthRequest";
import { useAuth0 } from '@auth0/auth0-react';

function AddRemoveForm() {
    const [username, setUsername] = useState('');
    const [action, setAction] = useState('add'); // add or remove friend
    const navigate = useNavigate();
    const { id } = useParams();

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
                    `${import.meta.env.VITE_API_URL}/convo/${id}/${action}`,
                    { username, user },
                    { username, user }
                );
                if(response.data.success === true) {
                    navigate(`/convo/${id}`);
                }
            } catch (error) {
                console.log(error.response.data.message);
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleFriend();
    }

    return (
        <div className='add-remove-form-page'>
            <h1 className='add-remove-heading'>Add/Remove Friend from Convo</h1>
            <form className="add-remove-form" onSubmit={handleSubmit}>
                <label className='username-label' htmlFor="username">Username (email)</label>
                <input 
                    className='username-input'
                    type="text"
                    id="username"
                    value={username}
                    onChange={handleUsernameChange}
                />
                <div className='action-section'>
                    <input
                        className='add-action-input'
                        type="radio"
                        id="add"
                        name="action"
                        value="add"
                        checked={action==='add'}
                        onChange={(e) => setAction(e.target.value)}
                    />
                    <label className="add-action-label" htmlFor="add">Add</label>
                    <input 
                        className='remove-action-input'
                        type="radio"
                        id="remove"
                        name="action"
                        value="remove"
                        checked={action === 'remove'}
                        onChange={(e) => setAction(e.target.value)}
                    />
                    <label className='remove-action-label' htmlFor="remove">Remove Friend</label>
                </div>
                <button className='confirm-button' type="submit">Confirm</button>
            </form>
        </div>
    )
}

export default AddRemoveForm;