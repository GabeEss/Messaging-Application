import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { makeAuthenticatedRequest } from "../utils/makeAuthRequest";
import { useAuth0 } from '@auth0/auth0-react';

function ChangeInfoFormPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const {
        isAuthenticated,
        getAccessTokenSilently,
        user
    } = useAuth0();

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(isAuthenticated) {
            try {
                const response = await makeAuthenticatedRequest(
                    getAccessTokenSilently,
                    'put',
                    `${import.meta.env.VITE_API_URL}/user/username`,
                    { username },
                    { user }
                );
                if(response.data.success === true) {
                    navigate('/home');
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

    const handleCancel = () => {
        navigate('/user');
    }

  return (
    <div>
        <h1>Change User Information</h1>
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input 
                type="text"
                id="username"
                value={username}
                onChange={handleUsernameChange}
                required
            />
            <button type="submit">Change</button>
        </form>
        <p>This will not change your name from prior messages.</p>
        <button onClick={handleCancel}>Cancel</button>
    </div>
  );
}

export default ChangeInfoFormPage;