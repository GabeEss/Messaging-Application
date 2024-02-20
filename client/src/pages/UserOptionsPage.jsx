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

    return (
        <div>
            <h1>User Options</h1>
            <button onClick={handleFriends}>See Friends</button>
            <button onClick={handleConvos}>See Conversations</button>
            <button>Change User Information</button>
            <button onClick={handleDelete}>Delete User</button>
            <button onClick={() => logout({ returnTo: window.location.origin })}>
            Log out
            </button>
        </div>
    )
}

export default UserOptionsPage;