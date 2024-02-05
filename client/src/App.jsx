import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/SideBar';
import MainDisplay from './components/MainDisplay';
import HomePage from './pages/HomePage';
import FriendPage from './pages/FriendPage';
import FriendForm from './pages/FriendFormPage';

function App() {
  return(
    <Router>
      <Sidebar />
      <MainDisplay>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/user/friends" element={<FriendPage/>}/>
          <Route path="/friend-form" element={<FriendForm/>}/>
        </Routes>
      </MainDisplay>
    </Router>
  );
}

export default App;
