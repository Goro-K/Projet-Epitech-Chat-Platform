import { Navigate } from "react-router-dom"
import PropTypes from 'prop-types';

export const ProtectedRoute = ({children}) => {
  const login = localStorage.getItem('isLogging')
  return login ? children : <Navigate to="/login" replace />;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node
};