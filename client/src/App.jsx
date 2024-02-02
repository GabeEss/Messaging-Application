import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/SideBar';
import MainDisplay from './components/MainDisplay';
import HomePage from './pages/HomePage';
import FriendPage from './pages/FriendPage';

function App() {
  return(
    <Router>
      <Sidebar />
      <MainDisplay>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/user/friends" element={<FriendPage/>}/>
        </Routes>
      </MainDisplay>
    </Router>
  );
}

export default App;
