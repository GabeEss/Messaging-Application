import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { makeAuthenticatedRequest } from "../utils/makeAuthRequest";
import { useAuth0 } from '@auth0/auth0-react';

function ConvoPage() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [messageLoading, setMessageLoading] = useState(false);
    const {
        isAuthenticated,
        getAccessTokenSilently
    } = useAuth0();
    const { convoId } = useParams();

    const getMessages = async () => {
        if (isAuthenticated && convoId) {
            try {
                const response = await makeAuthenticatedRequest(
                    getAccessTokenSilently,
                    'get',
                    `${import.meta.env.VITE_API_URL}/convo/${convoId}`
                );
                if(response.data.success === true) {
                    setMessages(response.data.convo.messages);
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

    // Call getMessages when convoId changes
    useEffect(() => {
        const renderMessages = async () => {
            setIsLoading(true);
            await getMessages();
            setIsLoading(false);
        };

        renderMessages();
    }, [convoId]);

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    }

    const createMessage = async () => {
        if(isAuthenticated && convoId) {
            try {
                const response = await makeAuthenticatedRequest(
                    getAccessTokenSilently,
                    'post',
                    `${import.meta.env.VITE_API_URL}/convo/${convoId}`,
                    { message }
                );
                if(response.data.success === true) {
                    console.log('Message created');
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
        setMessageLoading(true);
        await createMessage();
        setMessageLoading(false);
        setMessage('');
    }

    if(isLoading) return (<p>Loading...</p>);

    return(
        <div>
            <h1>Messages Page</h1>
            {messages && messages.length === 0 ? <p>No messages yet</p>
            :
                messages.map((message) => {
                    return (
                        <div key={message._id}>
                            <p>{message.message}</p>
                            <div>
                                <p>{message.sender}</p>
                                <p>{message.timestamp}</p>
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
                    {messageLoading ? <p>Creating...</p> : <button>Send</button>}
                </form>
            </div>
        </div>
    )
}

export default ConvoPage;