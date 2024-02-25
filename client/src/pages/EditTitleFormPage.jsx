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
        <div className='title-form-page section'>
            <h1 className='form-heading'>Edit Title</h1>
            <form className="title-form" onSubmit={handleEdit}>
                <input 
                    className='title-input'
                    type="text"
                    id="title"
                    value={title}
                    onChange={handleTitleChange}
                    maxLength={16}>
                </input>
                <p className='edit-title-note note'>16 characters maximum.</p>
                <div className='form-buttons'>
                    <button className='cancel-button' onClick={handleCancel}>Cancel</button>
                    <button className="confirm-button" type='submit'>Save Change</button>
                </div>
            </form>
        </div>
    )
}

export default EditTitleFormPage;

