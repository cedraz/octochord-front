import Cookies from "js-cookie";
import { Outlet, Navigate } from "react-router";

const ProtectedRoutes = () => {
    const token = Cookies.get("accessToken");

    // Rejeita token vazio, "undefined" ou "null" (pode acontecer
    // se o Cookies.set recebeu um valor inválido da API)
    const isAuthenticated = !!token && token !== "undefined" && token !== "null";

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;