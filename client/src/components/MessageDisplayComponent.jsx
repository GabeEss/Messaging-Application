import PropTypes from 'prop-types';
import { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { makeAuthenticatedRequest } from "../utils/makeAuthRequest";
import { useAuth0 } from '@auth0/auth0-react';
import EditMessageComponent from './EditMessageComponent';
import DeleteMessageComponent from './DeleteMessageComponent';
import { RenderMessagesContext } from '../contexts/RenderMessagesContext';
import ReactModal from 'react-modal';

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
                            <div className={message.senderId.toString() === mongoId.toString() ?
                            "message-container sender" : "message-container"} key={message._id}>
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
                                <p className='message-owner'>Posted by: {message.username}</p>
                                <div className="change-message-section">
                                    {message.senderId.toString() === mongoId.toString() ?
                                        <div className='edit-delete-buttons'>
                                            <p className='message-date'>
                                            {'Posted at: ' + new Date(message.timestamp).toLocaleDateString()
                                             + ' at ' + new Date(message.timestamp).toLocaleTimeString()}
                                            </p>
                                            {!editMessageClick && !deleteMessageClick ? 
                                            <div className='edit-delete-buttons'>
                                                <button
                                                className='small-message-button' 
                                                onClick={() => handleEditMessage(message._id)}
                                                title="Edit message"
                                                >
                                                    {'\u270E'}
                                                </button>
                                                <button
                                                className='small-message-button'
                                                onClick={() => handleDeleteMessage(message._id)}
                                                title="Delete message">
                                                    {'\u2716'}
                                                </button>
                                            </div>
                                            : null} 
                                        </div>
                                    : null}
                                    <ReactModal 
                                    isOpen={editMessageClick && messageToEdit === message._id}
                                    className="my-modal">
                                        <EditMessageComponent
                                            messageId={messageToEdit}
                                            messageText={message.message} 
                                            onEditDone={handleEditDone} />
                                        <button onClick={() => setEditMessageClick(false)}>Close</button>
                                    </ReactModal>
                                    <ReactModal
                                    isOpen={deleteMessageClick && messageToDelete === message._id}
                                    className="my-modal">
                                        <DeleteMessageComponent 
                                            messageId={messageToDelete}
                                            onDeleteDone={handleDeleteDone}/>
                                        <button onClick={() => setDeleteMessageClick(false)}>Close</button>
                                    </ReactModal>
                                </div>
                            </div>
                        )
                    })
                }
                <br></br>
                <div className='send-message-section'>
                    <form className='send-message-form' onSubmit={handleSubmit}>
                        <textarea 
                            className='message-input'
                            id="message"
                            value={message}
                            maxLength={60}
                            onChange={handleMessageChange}
                        />
                        <div className='submit-warning-section'>
                            <button disabled={messageLoading} className="create-button" type="submit">Send</button>
                            <p className="warning">There is a 60 character limit.</p>
                        </div>
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