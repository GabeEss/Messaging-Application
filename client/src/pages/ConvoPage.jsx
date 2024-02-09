import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { makeAuthenticatedRequest } from "../utils/makeAuthRequest";
import { useAuth0 } from '@auth0/auth0-react';

function ConvoPage() {
    const [convoTitle, setConvoTitle] = useState("");
    const [convoDate, setConvoDate] = useState("");
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [messageLoading, setMessageLoading] = useState(false);
    const {
        getAccessTokenSilently,
        user,
        isAuthenticated
    } = useAuth0();
    const { id } = useParams();

    const getMessages = async () => {
        if (id) {
            try {
                const response = await makeAuthenticatedRequest(
                    getAccessTokenSilently,
                    'get',
                    `${import.meta.env.VITE_API_URL}/convo/${id}`,
                    {},
                    { user },
                );
                if(response.data.success === true) {
                    setMessages(response.data.convo.messages);
                    setConvoTitle(response.data.convo.title);
                    setConvoDate(response.data.convo.date_created);
                    setUsers(response.data.convo.users);
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

    // Call getMessages when id changes
    useEffect(() => {
        const renderMessages = async () => {
            setIsLoading(true);
            await getMessages();
            setIsLoading(false);
        };

        renderMessages();
    }, [id, isAuthenticated]);

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
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
            {convoTitle ? <h1>{convoTitle}</h1> : <h1>No title</h1>}
            {convoDate ? <p>{convoDate}</p> : <p>No date</p>}
            {users && users.length === 0 ? <p>No users</p>
            : users.map((user) => {
                return (
                    <div key={user._id}>
                        <p>{user.username}</p>
                    </div>
                )
            })}
            {messages && messages.length === 0 ? <p>No messages yet</p>
            :
                messages.map((message) => {
                    return (
                        <div key={message._id}>
                            <p>{message.message}</p>
                            <div>
                                <p>{message.username}</p>
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
                    {messageLoading ? <p>Sending...</p> : <button>Send</button>}
                </form>
            </div>
        </div>
    )
}

export default ConvoPage;