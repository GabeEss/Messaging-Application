import PropTypes from 'prop-types';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { makeAuthenticatedRequest } from "../utils/makeAuthRequest";
import { useAuth0 } from '@auth0/auth0-react';

function DeleteMessageComponent ({messageId, onDeleteDone}) {
    const [isLoading, setIsLoading] = useState(false);
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
                console.log(error.response.data.message);
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        await deleteMessage();
        setIsLoading(false);
    }

    return (
        <div className='delete-popup'>
            {isLoading ? <h1 className='loading-heading'>Loading...</h1> 
            : 
            <form className="delete-message-form" onSubmit={handleSubmit}>
                <div className="label-and-checkbox">
                    <label className="delete-message-label" htmlFor="confirmDelete">Confirm deletion</label>
                    <button
                        className='small-message-button'
                        type="submit"
                        title="Confirm delete message">&#x2713;
                    </button>
                </div>
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