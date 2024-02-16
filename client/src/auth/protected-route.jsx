import PropTypes from 'prop-types';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import LoadingPage from '../pages/LoadingPage';

const ProtectedRoute = ({ children }) => {
    const { isLoading, isAuthenticated } = useAuth0();
    const location = useLocation();

    if (isLoading) {
        return <LoadingPage />;
      }
    
      if (!isAuthenticated) {
        return <Navigate to="/" replace state={{ from: location }} />;
      }
    
    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;