import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { makeAuthenticatedRequest } from "../utils/makeAuthRequest";
import { useAuth0 } from '@auth0/auth0-react';

function EditTitleFormPage() {
    const [title, setTitle] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();
    const {
        isAuthenticated,
        getAccessTokenSilently,
        user
    } = useAuth0();

    const handleEdit = async () => {
        event.preventDefault();
        if(isAuthenticated) {
            try {
                const response = await makeAuthenticatedRequest(
                    getAccessTokenSilently,
                    'put',
                    `${import.meta.env.VITE_API_URL}/convo/${id}/edit`,
                    { user, title },
                    { user }
                );
                if(response.data.success === true) {
                    navigate(`/convo/${id}`);
                }
            } catch (error) {
                console.log(error.response.data.message);
            }
        }
    }

    const handleCancel = () => {
        navigate(`/convo/${id}`);
    }

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    }

    return(
        <div>
            <h1>Edit Title</h1>
            <form onSubmit={handleEdit}>
                <label htmlFor="title">Title</label>
                <input 
                    type="text"
                    id="title"
                    value={title}
                    onChange={handleTitleChange}>
                </input>
                <button onClick={handleCancel}>Cancel</button>
                <button type='submit'>Save Change</button>
            </form>
        </div>
    )
}

export default EditTitleFormPage;

