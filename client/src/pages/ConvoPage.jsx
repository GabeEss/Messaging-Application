import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { makeAuthenticatedRequest } from "../utils/makeAuthRequest";
import { useAuth0 } from '@auth0/auth0-react';

function ConvoPage() {
    const [conversations, setConversations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const {
        isAuthenticated,
        getAccessTokenSilently
    } = useAuth0();

    useEffect(() => {
        const renderConversations = async () => {
            setIsLoading(true);
            await getConversations();
            setIsLoading(false);
        };

        renderConversations();
    }, []);

    const getConversations = async () => {
        if (isAuthenticated) {
            try {
                const response = await makeAuthenticatedRequest(
                    getAccessTokenSilently,
                    'get',
                    `${import.meta.env.VITE_API_URL}/convos`
                );
                if(response.data.success === true) {
                    setConversations(response.data.convos);
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

    const handleConvo = async () => {
        navigate('/convo-form');
    }

    if(isLoading) return (<p>Loading...</p>);

    return(
        <div>
            {conversations && conversations.length === 0 ? <p>No conversations found</p>
            :
                conversations.map((convo) => {
                    return (
                        <div key={convo._id}>
                            <button onClick={handleConvo}>{convo.title}</button>
                        </div>
                    )
                })
                // <pre>{JSON.stringify(conversations, null, 2)}</pre>
            }
            <br></br>
            <div>
                <button onClick={handleConvo}>New Conversation</button>
            </div>
        </div>
    )
}

export default ConvoPage;