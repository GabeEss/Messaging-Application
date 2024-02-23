import { Link } from 'react-router-dom';

function Sidebar() {
    return (
      <div className="sidebar">
        <ul className='sidebar-menu'>
            <li className='sidebar-item'>
                <Link to="/" className='sidebar-link'>Home</Link>
            </li>
        </ul>
      </div>
    );
  }

  export default Sidebar;