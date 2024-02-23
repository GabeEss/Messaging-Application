import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

function UserOptionsPage() {
    const navigate = useNavigate();
    const {
        isAuthenticated,
        logout
    } = useAuth0();

    const handleFriends = async () => {
        navigate('/user/friends');
    }

    const handleConvos = async () => {
        navigate('/convos');
    }

    const handleDelete = async () => {
        if(isAuthenticated) navigate('/user/delete');
    }

    const handleChange = async () => {
        if(isAuthenticated) navigate('/user/change');
    }

    return (
        <div className='options-page section'>
            <h1 className='options-heading'>User Options</h1>
            <button className='friends-button' onClick={handleFriends}>See Friends</button>
            <button className='convos-button' onClick={handleConvos}>See Conversations</button>
            <button className='change-button' onClick={handleChange}>Change User Information</button>
            <button className='delete-button' onClick={handleDelete}>Delete User</button>
            <button className='logout-button' onClick={() => logout({ returnTo: window.location.origin })}>
            Log out
            </button>
        </div>
    )
}

export default UserOptionsPage;