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
        <div>
            {messages && messages.length === 0 ? <p>No messages yet</p>
                :
                    messages.map((message) => {
                        return (
                            <div key={message._id}>
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
                                <div>
                                    <p>{message.username}</p>
                                    <p>{message.timestamp}</p>
                                </div>
                                <div>
                                    {message.senderId.toString() === mongoId.toString() ? 
                                    <div>
                                        <button onClick={() => handleEditMessage(message._id)}>
                                            Edit Message</button>
                                        <button onClick={() => handleDeleteMessage(message._id)}>
                                            Delete Message</button>
                                    </div>
                                    : null}
                                </div>
                            </div>
                        )
                    })
                }
                <div></div>
                <h2>Send a message</h2>
                <div>
                    <form onSubmit={handleSubmit}>
                        <input 
                            type="text"
                            id="message"
                            value={message}
                            onChange={handleMessageChange}
                        />
                        {messageLoading ? <p>Sending...</p> : <button>Send</button>}
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