import { useAuth0 } from "@auth0/auth0-react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { RenderMessagesProvider } from './contexts/RenderMessagesContext';

import Sidebar from './components/SideBar';
import MainDisplay from './components/MainDisplay';

import ProtectedRoute from './auth/protected-route';
import LoginPage from './pages/LoginPage';
import LoadingPage from './pages/LoadingPage';
import ErrorPage from './pages/ErrorPage';

import HomePage from './pages/HomePage';
import UserOptionsPage from './pages/UserOptionsPage';
import DeleteUserPage from './pages/DeleteUserPage';
import FriendPage from './pages/FriendPage';
import FriendForm from './pages/FriendFormPage';
import ChangeInfoFormPage from "./pages/ChangeInfoFormPage";

import ConvosPage from './pages/ConvosPage';

import ConvoPage from './pages/ConvoPage';
import ConvoForm from './pages/ConvoFormPage';
import AddRemoveForm from './pages/AddRemoveFormPage';
import DeleteConvo from './pages/DeleteConvoPage';
import EditTitleFormPage from './pages/EditTitleFormPage';

function App() {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <LoadingPage />;
  }

  return(
    <Router>
      <RenderMessagesProvider>
        <div className="app">
          <Sidebar />
          <MainDisplay>
            <Routes>
              <Route path="/" element={<LoginPage/>}/>
              <Route path="/error" element={<ErrorPage/>}/>
              <Route path="/home" element={<ProtectedRoute><HomePage/></ProtectedRoute>}/>
              <Route path="/user" element={<ProtectedRoute><UserOptionsPage/></ProtectedRoute>}/>
              <Route path="/user/delete" element={<ProtectedRoute><DeleteUserPage/></ProtectedRoute>}/>
              <Route path="/user/friends" element={<ProtectedRoute><FriendPage/></ProtectedRoute>}/>
              <Route path="/user/change" element={<ProtectedRoute><ChangeInfoFormPage/></ProtectedRoute>}/>
              <Route path="/friend-form" element={<ProtectedRoute><FriendForm/></ProtectedRoute>}/>
              <Route path='/convos' element={<ProtectedRoute><ConvosPage/></ProtectedRoute>}/>
              <Route path='/convo/:id' element={<ProtectedRoute><ConvoPage/></ProtectedRoute>}/>
              <Route path="/convo-form" element={<ProtectedRoute><ConvoForm/></ProtectedRoute>}/>
              <Route path="convo/:id/add-remove-user" element={<ProtectedRoute><AddRemoveForm/></ProtectedRoute>}/>
              <Route path='convo/:id/edit-title' element={<ProtectedRoute><EditTitleFormPage/></ProtectedRoute>}/>
              <Route path="convo/:id/delete" element={<ProtectedRoute><DeleteConvo/></ProtectedRoute>}/>
            </Routes>
          </MainDisplay>
        </div>
      </RenderMessagesProvider>
    </Router>
  );
}

export default App;
