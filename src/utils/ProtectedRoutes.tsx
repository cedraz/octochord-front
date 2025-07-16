import Cookies from "js-cookie";
import { Outlet, Navigate } from "react-router";

const ProtectedRoutes = () => {
    const token = Cookies.get("accessToken")
    return token ? <Outlet /> : <Navigate to="/login" />
}

export default ProtectedRoutes;