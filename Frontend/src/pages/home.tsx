import { Navigate, Route, Routes } from "react-router-dom"
import type { AuthenticatedProps } from "../features/auth/types/type.auth"
import RegisterPage from "./auth/registerPage"
import { LoginPage } from "./auth/loginPage"
import SalesPage from "./components/salesPage"
import { ListPage } from "./components/listPage"
import { ProveedorPage } from "./components/proveedorPage"
import { CarritoView } from "../features/proveedores/ui/carritoView"
import { NotaPage } from "./components/notaPage"
import { CarritosGuardadosView } from "../features/carrito/components/carritoGuardado"
import { GastosPage } from "./components/gastosPage"
import { ClientesPage } from "./components/clientesPage"
import { EstadisticasPage } from "./components/estadisticasPage"
import { ConvertidorPage } from "./components/convertidorPage"
import { DashboardPage } from "./components/dashboardPage"
import { ArchivosView } from "../features/archivo/archivoView"
import { ChangePasswordForm } from "./auth/changePasswordPage"


export const Home = ({ isAuthenticated, setIsAuthenticated }: AuthenticatedProps) => {
    if (isAuthenticated === null) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Cargando...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/list" element={<ListPage />} />
            <Route path="/proveedores" element={<ProveedorPage />} />
            <Route path="/gastos" element={<GastosPage />} />
            <Route path="/clientes" element={<ClientesPage />} />
            <Route path="/estadisticas" element={<EstadisticasPage />} />
            <Route path="/convertidor" element={<ConvertidorPage />} />
            <Route path="/archivos" element={<ArchivosView />} />
            <Route path="/carritos-guardados" element={<CarritosGuardadosView />} />
            <Route path="/notas" element={<NotaPage />} />
            <Route path="/carrito" element={<CarritoView />} />
            <Route path="/change-password" element={<ChangePasswordForm />} />
            <Route path="/register" element={<RegisterPage setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated} />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    )
}