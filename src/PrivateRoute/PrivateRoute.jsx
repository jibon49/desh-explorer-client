import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";

import PropTypes from 'prop-types';
import { AuthContext } from "../Authproviders/AuthProviders";



const PrivateRoute = ({children}) => {

    const {user, loading} = useContext(AuthContext);
    const location = useLocation();

    if(loading){
        return <span className="loading loading-spinner mx-auto flex loading-lg"></span>
    }

    if(user){
        return children
    }

    return (
        <Navigate state={location.pathname} to='/login'></Navigate>
    );
};

PrivateRoute.propTypes = {
    children: PropTypes.object
  };

export default PrivateRoute;