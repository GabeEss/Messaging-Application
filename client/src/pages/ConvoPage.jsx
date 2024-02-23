import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { makeAuthenticatedRequest } from "../utils/makeAuthRequest";
import { useAuth0 } from '@auth0/auth0-react';
import MessageDisplayComponent from '../components/MessageDisplayComponent';
import { RenderMessagesContext } from '../contexts/RenderMessagesContext';

function ConvoPage() {
    const [convoTitle, setConvoTitle] = useState("");
    const [convoDate, setConvoDate] = useState("");
    const [convoOwner, setConvoOwner] = useState(false); // The convo owner can add/remove users
    const [notOwner, setNotOwner] = useState(false); // Can send messages and leave the convo
    const [mongoId, setMongoId] = useState(""); // The mongoId of the current user
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [isRendering, setIsRendering] = useState(true);
    const {shouldRenderMessages} = useContext(RenderMessagesContext);
    
    const {
        getAccessTokenSilently,
        user,
        isLoading
    } = useAuth0();
    const { id } = useParams();
    const navigate = useNavigate();

    const getConvo = async () => {
        if (id && !isLoading) {
            try {
                const response = await makeAuthenticatedRequest(
                    getAccessTokenSilently,
                    'get',
                    `${import.meta.env.VITE_API_URL}/convo/${id}`,
                    {},
                    { user },
                );
                if(response.data.success === true) {
                    setMessages(response.data.convo.messages);
                    setConvoTitle(response.data.convo.title);
                    setConvoDate(response.data.convo.date_created);
                    setUsers(response.data.convo.users);
                    setMongoId(response.data.mongoId);
                    if(response.data.owner)
                        setConvoOwner(response.data.owner);
                    else 
                        setNotOwner(true);
                }
            } catch (error) {
                console.log(error.response.data.message);
            }
        }
    }

    // Call getMessages when id changes
    useEffect(() => {
        const renderConvoDetails = async () => {
            setIsRendering(true);
            await getConvo();
            setIsRendering(false);
        };

        renderConvoDetails();
    }, [id, isLoading, shouldRenderMessages]);

    const handleDelete = async () => {
        if(convoOwner) {
            navigate(`/convo/${id}/delete`);
        }
    }

    const addRemoveUser = async () => {
        if(convoOwner) {
            navigate(`/convo/${id}/add-remove-user`);
        }
    }

    const handleTitleChange = async () => {
        navigate(`/convo/${id}/edit-title`);
    }

    const leaveConvo = async () => {
        if(notOwner) {
            try {
                const response = await makeAuthenticatedRequest(
                    getAccessTokenSilently,
                    'put',
                    `${import.meta.env.VITE_API_URL}/convo/${id}/leave`,
                    { user },
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

    if(isRendering) return (<h2 className='loading-heading'>Loading...</h2>);

    return(
        <div className="convo-page section">
            {convoTitle ? <h1 className='convo-title'>{convoTitle}</h1> : <h1 className='no-title'>No title</h1>}
            {convoDate ? <p className='convo-date'>{convoDate}</p> : <p className="no-date">No date</p>}
            {convoOwner ? <button className='add-remove-button' onClick={addRemoveUser}>Add/Remove a User</button> : null}
            {convoOwner ? <button className='delete-convo-button' onClick={handleDelete}>Delete Convo</button> : null}
            {notOwner ? <button className='leave-convo-button' onClick={leaveConvo}>Leave Convo</button> : null}
            <button className="edit-title-button" onClick={handleTitleChange}>Edit Title</button>
            <div className='friends-list'>
                <h4 className='users-label'>Users: </h4>
                {users && users.length === 0 ? <p className='no-users'>No users</p>
                : users.map((user) => {
                    return (
                        <div key={user._id}>
                            <p className='friend-item'>{user.username}</p>
                        </div>
                    )
                })}
            </div>
            <MessageDisplayComponent initialMessages={messages} mongoId={mongoId} />
        </div>
    )
}

export default ConvoPage;