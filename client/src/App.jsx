import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/SideBar';
import MainDisplay from './components/MainDisplay';
import HomePage from './pages/HomePage';
import FriendPage from './pages/FriendPage';
import ConvosPage from './pages/ConvosPage';
import ConvoPage from './pages/ConvoPage';
import FriendForm from './pages/FriendFormPage';
import ConvoForm from './pages/ConvoFormPage';
import AddRemoveForm from './pages/AddRemoveFormPage';
import DeleteConvo from './pages/DeleteConvoFormPage';
import EditTitleFormPage from './pages/EditTitleFormPage';

function App() {
  return(
    <Router>
      <Sidebar />
      <MainDisplay>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/user/friends" element={<FriendPage/>}/>
          <Route path='/convos' element={<ConvosPage/>}/>
          <Route path='/convo/:id' element={<ConvoPage/>}/>
          <Route path="/friend-form" element={<FriendForm/>}/>
          <Route path="/convo-form" element={<ConvoForm/>}/>
          <Route path="convo/:id/add-remove-user" element={<AddRemoveForm/>}/>
          <Route path='convo/:id/edit-title' element={<EditTitleFormPage/>}/>
          <Route path="convo/:id/delete" element={<DeleteConvo/>}/>
        </Routes>
      </MainDisplay>
    </Router>
  );
}

export default App;
