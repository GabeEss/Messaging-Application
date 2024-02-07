import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/SideBar';
import MainDisplay from './components/MainDisplay';
import HomePage from './pages/HomePage';
import FriendPage from './pages/FriendPage';
import ConvoPage from './pages/ConvoPage';
import FriendForm from './pages/FriendFormPage';
import ConvoForm from './pages/ConvoFormPage';

function App() {
  return(
    <Router>
      <Sidebar />
      <MainDisplay>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/user/friends" element={<FriendPage/>}/>
          <Route path='/convos' element={<ConvoPage/>}/>
          <Route path="/friend-form" element={<FriendForm/>}/>
          <Route path="/convo-form" element={<ConvoForm/>}/>
        </Routes>
      </MainDisplay>
    </Router>
  );
}

export default App;
