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




export const Home = ({isAuthenticated, setIsAuthenticated}:AuthenticatedProps) =>{
    if(!isAuthenticated){
        return <Navigate to="/login" replace/>
    }
    
    return(    
            <Routes>
                <Route path="/" element={isAuthenticated ? <Navigate to="/sales" replace/> : <LoginPage setIsAuthenticated={setIsAuthenticated}  isAuthenticated={isAuthenticated}/>}/> 
                <Route path="/sales" element={isAuthenticated ? <SalesPage/> : <Navigate to="/" replace/>}/>
                <Route path="/list" element={isAuthenticated ? <ListPage/> : <Navigate to="/" replace/>}/>
                <Route path="/proveedores" element={isAuthenticated ? <ProveedorPage/> : <Navigate to="/" replace/>}/>
                <Route path="/gastos" element={isAuthenticated ? <GastosPage/> : <Navigate to="/" replace/>}/>
                <Route path="/clientes" element={isAuthenticated ? <ClientesPage/> : <Navigate to="/" replace/>}/>
                <Route path="/estadisticas" element={isAuthenticated ? <EstadisticasPage/> : <Navigate to="/" replace/>}/>
                <Route path="/convertidor" element={isAuthenticated ? <ConvertidorPage/> : <Navigate to="/" replace/>}/>
                <Route path="/carritos-guardados" element={isAuthenticated ? <CarritosGuardadosView /> : <Navigate to="/" replace/>} />
                <Route path="/notas" element={isAuthenticated ? <NotaPage/> : <Navigate to="/" replace/>}/>
                 <Route path="/carrito" element={isAuthenticated ? <CarritoView/> : <Navigate to="/" replace/>}/>

                <Route path="/register" element={isAuthenticated ? <RegisterPage setIsAuthenticated={setIsAuthenticated}  isAuthenticated={isAuthenticated}/> : <Navigate to="/" replace/>}/>
                <Route path="*" element={<Navigate to={isAuthenticated ? "/sales" : "/"} replace/>}/>
            </Routes>
        
        
    )
}


