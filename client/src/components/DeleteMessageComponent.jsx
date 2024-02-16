import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { makeAuthenticatedRequest } from "../utils/makeAuthRequest";
import { useAuth0 } from '@auth0/auth0-react';

function DeleteMessageComponent ({messageId, onDeleteDone}) {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const {
        getAccessTokenSilently,
        user,
        isAuthenticated
    } = useAuth0();
    const { id } = useParams();

    const deleteMessage = async () => {
        if(isAuthenticated) {
            try {
                const response = await makeAuthenticatedRequest(
                    getAccessTokenSilently,
                    'delete',
                    `${import.meta.env.VITE_API_URL}/convo/${id}/message`,
                    { user, messageId },
                    { user }
                );
                if(response.data.success === true) {
                    console.log('Message deleted');
                    onDeleteDone();
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        await deleteMessage();
        setIsLoading(false);
        navigate(`/convo/${id}`);
    }

    return (
        <div className='popup'>
            <h1>Delete Message</h1>
            {isLoading ? <p>Loading...</p> 
            : 
            <form onSubmit={handleSubmit}>
                <label htmlFor="confirmDelete">Confirm deletion</label>
                <input type='checkbox' id='confirmDelete' required />
                <button type="submit">Delete</button>
            </form>
            }      
        </div>
    );
}

DeleteMessageComponent.propTypes = {
    messageId: PropTypes.string.isRequired,
    onDeleteDone: PropTypes.func.isRequired
}

export default DeleteMessageComponent;