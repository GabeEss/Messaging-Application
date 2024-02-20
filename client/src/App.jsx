import { useAuth0 } from "@auth0/auth0-react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { RenderMessagesProvider } from './contexts/RenderMessagesContext';
import ProtectedRoute from './auth/protected-route';
import Sidebar from './components/SideBar';
import MainDisplay from './components/MainDisplay';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import UserOptionsPage from './pages/UserOptionsPage';
import DeleteUserPage from './pages/DeleteUserPage';
import FriendPage from './pages/FriendPage';
import ConvosPage from './pages/ConvosPage';
import ConvoPage from './pages/ConvoPage';
import FriendForm from './pages/FriendFormPage';
import ConvoForm from './pages/ConvoFormPage';
import AddRemoveForm from './pages/AddRemoveFormPage';
import DeleteConvo from './pages/DeleteConvoFormPage';
import EditTitleFormPage from './pages/EditTitleFormPage';
import LoadingPage from './pages/LoadingPage';

function App() {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <LoadingPage />;
  }

  return(
    <Router>
      <RenderMessagesProvider>
        <Sidebar />
        <MainDisplay>
          <Routes>
            <Route path="/" element={<LoginPage/>}/>
            <Route path="/home" element={<ProtectedRoute><HomePage/></ProtectedRoute>}/>
            <Route path="/user" element={<ProtectedRoute><UserOptionsPage/></ProtectedRoute>}/>
            <Route path="/user/delete" element={<ProtectedRoute><DeleteUserPage/></ProtectedRoute>}/>
            <Route path="/user/friends" element={<ProtectedRoute><FriendPage/></ProtectedRoute>}/>
            <Route path='/convos' element={<ProtectedRoute><ConvosPage/></ProtectedRoute>}/>
            <Route path='/convo/:id' element={<ProtectedRoute><ConvoPage/></ProtectedRoute>}/>
            <Route path="/friend-form" element={<ProtectedRoute><FriendForm/></ProtectedRoute>}/>
            <Route path="/convo-form" element={<ProtectedRoute><ConvoForm/></ProtectedRoute>}/>
            <Route path="convo/:id/add-remove-user" element={<ProtectedRoute><AddRemoveForm/></ProtectedRoute>}/>
            <Route path='convo/:id/edit-title' element={<ProtectedRoute><EditTitleFormPage/></ProtectedRoute>}/>
            <Route path="convo/:id/delete" element={<ProtectedRoute><DeleteConvo/></ProtectedRoute>}/>
          </Routes>
        </MainDisplay>
      </RenderMessagesProvider>
    </Router>
  );
}

export default App;
