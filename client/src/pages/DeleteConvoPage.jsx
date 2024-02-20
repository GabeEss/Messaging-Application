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
                if (error.response && error.response.status === 401) {
                    console.log(error.response.data.message);
                } else {
                    console.log(error.message);
                }
            }
        }
    }

    const handleReturn = () => {
        navigate(`/convo/${id}`);
    }

    return(
        <div>
            <h1>Delete Convo</h1>
            <p>Are you sure you want to delete this conversation?</p>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={handleReturn}>Cancel</button>
        </div>
    )
}

export default DeleteConvo;