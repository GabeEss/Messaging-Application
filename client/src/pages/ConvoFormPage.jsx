import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { makeAuthenticatedRequest } from "../utils/makeAuthRequest";
import { useAuth0 } from '@auth0/auth0-react';

function ConvoForm() {
    const [title, setTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const {
        isAuthenticated,
        getAccessTokenSilently,
        user
    } = useAuth0();
    const navigate = useNavigate();

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    }

    const createConvo = async () => {
        if(isAuthenticated) {
            try {
                const response = await makeAuthenticatedRequest(
                    getAccessTokenSilently,
                    'post',
                    `${import.meta.env.VITE_API_URL}/convo`,
                    { title, user },
                    { title, user }
                );
                if(response.data.success === true) {
                    console.log('Conversation created');
                }
            } catch (error) {
                console.log(error.response.data.message);
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        await createConvo();
        setIsLoading(false);
        navigate('/convos');
    }

    
    return (
        <div>
            <h1>Create a Conversation</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title</label>
                <input 
                    type="text"
                    id="title"
                    value={title}
                    onChange={handleTitleChange}
                />
                {isLoading ? <p>Creating...</p> : <button>Create</button>}
            </form>
        </div>
    )
}

export default ConvoForm;