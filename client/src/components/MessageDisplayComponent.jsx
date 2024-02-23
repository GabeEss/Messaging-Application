import PropTypes from 'prop-types';
import { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { makeAuthenticatedRequest } from "../utils/makeAuthRequest";
import { useAuth0 } from '@auth0/auth0-react';
import EditMessageComponent from './EditMessageComponent';
import DeleteMessageComponent from './DeleteMessageComponent';
import { RenderMessagesContext } from '../contexts/RenderMessagesContext';

function MessageDisplayComponent({ initialMessages, mongoId }) {
    const [messages, setMessages] = useState(initialMessages);
    const [message, setMessage] = useState('');
    const [messageToEdit, setMessageToEdit] = useState(null);
    const [messageToDelete, setMessageToDelete] = useState(null);
    const [messageLoading, setMessageLoading] = useState(false);
    const [editMessageClick, setEditMessageClick] = useState(false);
    const [deleteMessageClick, setDeleteMessageClick] = useState(false);
    const { shouldRenderMessages, setShouldRenderMessages } = useContext(RenderMessagesContext);
    const {
        getAccessTokenSilently,
        user,
    } = useAuth0();
    const { id } = useParams();

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessageLoading(true);
        await createMessage();
        setMessageLoading(false);
        setMessage('');
    }

    const createMessage = async () => {
        if(id) {
            try {
                const response = await makeAuthenticatedRequest(
                    getAccessTokenSilently,
                    'post',
                    `${import.meta.env.VITE_API_URL}/convo/${id}`,
                    { message, user },
                    { message, user }
                );
                if(response.data.success === true) {
                    setMessages(response.data.convo.messages);
                }
            } catch (error) {
                console.log(error.response.data.message);
            }
        }
    }

    const handleEditMessage = (id) => {
        setMessageToEdit(id);
        setEditMessageClick(true);
    }

    const handleDeleteMessage = (id) => {
        setMessageToDelete(id);
        setDeleteMessageClick(true);
    }

    const handleEditDone = () => {
        setMessageToEdit(null);
        setEditMessageClick(false);
        setShouldRenderMessages(!shouldRenderMessages);
    };

    const handleDeleteDone = () => {
        setMessageToDelete(null);
        setDeleteMessageClick(false);
        setShouldRenderMessages(!shouldRenderMessages);
    }

    return(
        <div className='message-display-component'>
            {messages && messages.length === 0 ? <h1 className='no-messages-heading'>No messages yet</h1>
                :
                    messages.map((message) => {
                        return (
                            <div className="message-container" key={message._id}>
                                {editMessageClick && messageToEdit === message._id ?
                                    <EditMessageComponent
                                        messageId={messageToEdit}
                                        messageText={message.message} 
                                        onEditDone={handleEditDone} />
                                : deleteMessageClick && messageToDelete === message._id ?
                                    <DeleteMessageComponent 
                                        messageId={messageToDelete}
                                        onDeleteDone={handleDeleteDone}/>
                                : <p>{message.message}</p>}
                                <div className="message-details">
                                    <p className='message-text'>{message.username}</p>
                                    <p className='message-date'>{message.timestamp}</p>
                                </div>
                                <div className="change-message-section">
                                    {message.senderId.toString() === mongoId.toString() ? 
                                    <div>
                                        <button className='edit-message-button' onClick={() => handleEditMessage(message._id)}>
                                            Edit Message</button>
                                        <button className='delete-message-button' onClick={() => handleDeleteMessage(message._id)}>
                                            Delete Message</button>
                                    </div>
                                    : null}
                                </div>
                            </div>
                        )
                    })
                }
                <br></br>
                <div className='send-message-section'>
                    <h2 className='send-message-heading'>Send a message</h2>
                    <form className='send-message-form' onSubmit={handleSubmit}>
                        <input 
                            className='message-input'
                            type="text"
                            id="message"
                            value={message}
                            maxLength={60}
                            onChange={handleMessageChange}
                        />
                        <button disabled={messageLoading} className="create-button" type="submit">Send</button>
                    </form>
                </div>
            </div>
    )
}

MessageDisplayComponent.propTypes = {
    initialMessages: PropTypes.array.isRequired,
    mongoId: PropTypes.string.isRequired
};

export default MessageDisplayComponent;