import { useNavigate, useParams } from 'react-router-dom';
import { makeAuthenticatedRequest } from "../utils/makeAuthRequest";
import { useAuth0 } from '@auth0/auth0-react';

function DeleteConvo() {
    const navigate = useNavigate();
    const { id } = useParams();
    const {
        isAuthenticated,
        getAccessTokenSilently,
        user
    } = useAuth0();

    const handleDelete = async () => {
        if(isAuthenticated) {
            try {
                const response = await makeAuthenticatedRequest(
                    getAccessTokenSilently,
                    'delete',
                    `${import.meta.env.VITE_API_URL}/convo/${id}`,
                    {},
                    { user }
                );
                if(response.data.success === true) {
                    navigate('/convos');
                }
            } catch (error) {
                console.log(error.response.data.message);
            }
        }
    }

    const handleReturn = () => {
        navigate(`/convo/${id}`);
    }

    return(
        <div className="delete-convo-page section">
            <h1 className="delete-convo-heading">Delete Convo</h1>
            <p className='delete-warning note'>Are you sure you want to delete this conversation?</p>
            <div className='form-buttons'>
                <button className="confirm-button" onClick={handleDelete}>Delete</button>
                <button className="cancel-button" onClick={handleReturn}>Cancel</button>
            </div>
            
        </div>
    )
}

export default DeleteConvo;