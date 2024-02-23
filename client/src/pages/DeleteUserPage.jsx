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
                console.log(error.response.data.message);
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
        <div className="delete-user-page section">
            <h1 className="delete-user-heading">Delete User</h1>
            {isLoading ? <h1 className='loading-heading'>Loading...</h1> 
            :
            <div className='delete-section'> 
                <form className='delete-form' onSubmit={handleSubmit}>
                    <label className="confirm-label" htmlFor="confirmDelete">Confirm deletion</label>
                    <input className="confirm-input" type='checkbox' id='confirmDelete' required />
                    <div className='form-buttons'>
                        <button className='confirm-button' type="submit">Delete</button>
                        <button className='cancel-button' onClick={() => navigate('/user')}>Cancel</button>
                    </div>
                </form>
                <br />
                <p className='delete-warning'>You are about to delete your profile on Messaging Application.</p>
                <p className='delete-note'>This will not delete your auth0 account; in other words, you can still login with the same email and password and a new account will be created.</p>
                
            </div>
            }    
        </div>
    )
}

export default DeleteUserPage;