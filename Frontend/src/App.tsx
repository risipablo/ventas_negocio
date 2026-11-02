import { useEffect, useState } from "react";
import { config } from "./config";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { UserProvider } from "./context/userProvider";
import axios from "axios";
import { LoginPage } from "./pages/auth/loginPage";
import RegisterPage from "./pages/auth/registerPage";
import { Home } from "./pages/home";
import Navbar from "./components/layout/navbar";
import { LogoSpinner } from "./components/ui/spinner";
import { Toaster } from "react-hot-toast";
import { NotasProvider } from "./context/useNotaContext";
import { CarritoProvider } from "./context/useCarrito.tsx";
import { GastosProvider } from "./context/gastosContext";
import { CarritosGuardadosProvider } from "./context/useCarritoGuardadoContext.tsx";

const serverFront = config.Api;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }
    const validateToken = async () => {
      try {
        await axios.get(`${serverFront}/api/auth/validate-token`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    validateToken();
  }, []);

  
  useEffect(() => {
    const onExpired = () => setIsAuthenticated(false);
    window.addEventListener('app:auth-expired', onExpired);
    return () => window.removeEventListener('app:auth-expired', onExpired);
  }, []);

  return (
    <BrowserRouter>
      <UserProvider isAuthenticated={isAuthenticated}>
        
          <CarritoProvider>
            <CarritosGuardadosProvider>
              <GastosProvider>
                <NotasProvider>

                  <Toaster
                    position="top-center"
                    toastOptions={{
                      style: { background: 'rgba(28, 42, 68)', color: '#fff' },
                      duration: 3000,
                    }}
                  />

              
                  {loading || isAuthenticated === null ? (
                    <LogoSpinner fullScreen text="cargando datos" />
                  ) : isAuthenticated ? (
                    <>
                      <Navbar setIsAuthenticated={setIsAuthenticated} />
                      <Home isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
                    </>
                  ) : (
                    <Routes>
                      <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} isAuthenticated={null} />} />
                      <Route path="/register" element={<RegisterPage setIsAuthenticated={setIsAuthenticated} isAuthenticated={null} />} />
                      <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                  )}

                </NotasProvider>
              </GastosProvider>
            </CarritosGuardadosProvider>
          </CarritoProvider>
        
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;