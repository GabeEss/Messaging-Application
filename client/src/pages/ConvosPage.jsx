import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { makeAuthenticatedRequest } from "../utils/makeAuthRequest";
import { useAuth0 } from '@auth0/auth0-react';

function ConvosPage() {
    const [conversations, setConversations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const {
        getAccessTokenSilently,
        user,
        isAuthenticated
    } = useAuth0();

    useEffect(() => {
        const renderConversations = async () => {
            setIsLoading(true);
            await getConversations();
            setIsLoading(false);
        };

        renderConversations();
    }, [isAuthenticated]);

    const getConversations = async () => {
        if(isAuthenticated) {
            try {
                const response = await makeAuthenticatedRequest(
                    getAccessTokenSilently,
                    'get',
                    `${import.meta.env.VITE_API_URL}/convos`,
                    {},
                    { user }
                );
                if(response.data.success === true) {
                    setConversations(response.data.convos);
                }
            } catch (error) {
                console.log(error.response.data.message);
            }
        }
    }

    const handleNewConvo = async () => {
        navigate('/convo-form');
    }

    const handleConvo = async (convoId) => {
        navigate(`/convo/${convoId}`);
    }

    if(isLoading) return (<h2 className='loading-heading'>Loading...</h2>);

    return(
        <div className="convos-page section">
            <h1 className='convos-heading'>User Convos</h1>
            <div className="current-convos">
                {conversations && conversations.length === 0 ? <p>No conversations found</p>
                :
                    conversations.map((convo) => {
                        return (
                            <div key={convo._id}>
                                <button className="convo-button" onClick={() => handleConvo(convo._id)}>{convo.title}</button>
                            </div>
                        )
                    })
                }
            </div>
            <br></br>
            <div className='new-convo-section'>
                <button className="new-convo-button" onClick={handleNewConvo}>New Conversation</button>
            </div>
        </div>
    )
}

export default ConvosPage;