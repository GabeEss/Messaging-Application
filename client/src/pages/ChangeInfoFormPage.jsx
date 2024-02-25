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
                console.log(error.response.data.message);
            }
        }
    }

    const handleCancel = () => {
        navigate('/user');
    }

  return (
    <div className='change-info-page section'>
        <h1 className='change-info-header'>Change User Information</h1>
        <form className='change-info-form' onSubmit={handleSubmit}>
            <label className="username-label" htmlFor="username">Username</label>
            <input 
                className='username-input'
                type="text"
                id="username"
                value={username}
                onChange={handleUsernameChange}
                maxLength={16}
                required
            />
            <div className='form-buttons'>
                <button className='confirm-button' type="submit">Change</button>
                <button className='cancel-button' onClick={handleCancel}>Cancel</button>
            </div>
        </form>        
        <p className='change-info-note note'>This will not change your name from prior messages. Max 16 characters.</p>
    </div>
  );
}

export default ChangeInfoFormPage;