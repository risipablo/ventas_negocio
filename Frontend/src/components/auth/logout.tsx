
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { useAuth } from "../../features/auth/hooks/useAuth";

export const LogOutComponent = () => {
    const { logout, loading } = useAuth();

    return (
        <motion.button
            onClick={logout}
            disabled={loading}
            className="delete-account-btn"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
        >
            <LogOut size={16} />
            <span>{loading ? " Cerrando sesión..." : " Cerrar Sesión"}</span>
        </motion.button>
    );
};