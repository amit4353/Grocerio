import { Navigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";


const AdminRoute = ({ children }) => {
    const { user } = useAuth();

    if(!user){
        return <Navigate to="/users/login" />
    }

    if(!user.isAdmin){
        return <Navigate to="/" />
    }

    return children;
}

export default AdminRoute;