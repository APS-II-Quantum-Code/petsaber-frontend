import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "@/context/AuthContext";

export const ProtectedRoute: React.FC = () => {
    const {user, loading} = useAuth();
    if (loading) return null; // could render a spinner
    return user ? <Outlet/> : <Navigate to="/login" replace/>;
};

export const RoleRoute: React.FC<{ allow: Array<"TUTOR" | "CONSULTOR"> }> = ({allow}) => {
    const {user, loading} = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to="/login" replace/>;
    return allow.includes(user.role) ? (
        <Outlet/>
    ) : (
        <Navigate
            to={
                user.role === "TUTOR"
                    ? "/tutor"
                    : user.role === "CONSULTOR"
                        ? "/consultor"
                        : "/"
            }
            replace
        />
    );
};
