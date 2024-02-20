import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { makeAuthenticatedRequest } from "../utils/makeAuthRequest";
import { useAuth0 } from '@auth0/auth0-react';

function DeleteUserPage() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const {
        getAccessTokenSilently,
        user,
        isAuthenticated,
        logout
    } = useAuth0();

    const deleteUser = async () => {
        if(isAuthenticated) {
            try {
                const response = await makeAuthenticatedRequest(
                    getAccessTokenSilently,
                    'delete',
                    `${import.meta.env.VITE_API_URL}/user`,
                    {},
                    { user }
                );
                if(response.data.success === true) {
                    console.log('User deleted');
                    
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
        setIsLoading(true);
        await deleteUser();
        setIsLoading(false);
        logout({returnTo: window.location.origin});
    }

    return (
        <div>
            <h1>Delete User</h1>
            {isLoading ? <p>Loading...</p> 
            :
            <div> 
                <form onSubmit={handleSubmit}>
                    <label htmlFor="confirmDelete">Confirm deletion</label>
                    <input type='checkbox' id='confirmDelete' required />
                    <button type="submit">Delete</button>
                </form>
                <br />
                <p>You are about to delete your profile on Messaging Application.</p>
                <p>This will not delete your auth0 account; in other words, you can still login with the same email and password and a new account will be created.</p>
                <button onClick={() => navigate('/user')}>Cancel</button>
            </div>
            }    
        </div>
    )
}

export default DeleteUserPage;