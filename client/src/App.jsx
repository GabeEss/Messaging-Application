import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/SideBar';
import MainDisplay from './components/MainDisplay';
import HomePage from './pages/HomePage';

function App() {
  return(
    <Router>
      <Sidebar>
        <MainDisplay>
          <Routes>
            <Route path="/" element={<HomePage/>}/>
          </Routes>
        </MainDisplay>
      </Sidebar>
    </Router>
  );
}

export default App;
