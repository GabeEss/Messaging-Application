import PropTypes from 'prop-types';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { makeAuthenticatedRequest } from "../utils/makeAuthRequest";
import { useAuth0 } from '@auth0/auth0-react';

function EditMessageComponent ({ messageId, messageText, onEditDone }) {
    const [message, setMessage] = useState(messageText);
    const [isLoading, setIsLoading] = useState(false);
    const {
        getAccessTokenSilently,
        user,
        isAuthenticated
    } = useAuth0();
    const { id } = useParams();

    const handleTextChange = (event) => {
        setMessage(event.target.value);
    }

    const editMessage = async () => {
        if(isAuthenticated) {
            try {
                const response = await makeAuthenticatedRequest(
                    getAccessTokenSilently,
                    'put',
                    `${import.meta.env.VITE_API_URL}/convo/${id}/message`,
                    { message, user, messageId },
                    { user }
                );
                if(response.data.success === true) {
                    console.log('Message updated');
                    onEditDone();
                }
            } catch (error) {
                console.log(error.response.data.message);
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        await editMessage();
        setIsLoading(false);
    }

    return (
        <div className='edit-popup'>
            {isLoading ? <h1 className='loading-heading'>Loading...</h1> 
            : 
            <form className='edit-message-form' onSubmit={handleSubmit}>
                <textarea 
                    className='message-input'
                    id="message"
                    value={message}
                    onChange={handleTextChange}
                    maxLength={60}
                />
                <div className='edit-delete-buttons'>
                    <button
                    className='small-message-button'
                    type="submit"
                    title="Confirm edit message">{'\u270E'}</button>
                </div>
            </form>
            }      
        </div>
    );
}

EditMessageComponent.propTypes = {
    messageId: PropTypes.string.isRequired,
    messageText: PropTypes.string.isRequired,
    onEditDone: PropTypes.func.isRequired
}

export default EditMessageComponent;