import { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Encabezado from "./components/navegacion/Encabezado";
import Inicio from "./views/Inicio";
import Empleados from './views/Empleado';
import Incidencias from './views/Incidencias';
import Catalogo from "./views/Catalogo";
import Asistencias from "./views/RegistroAsistencia.jsx";
import Turnos from './views/Turnos';
import Usuarios from './views/Usuarios';
import Login from "./views/Login";
import Perfil from "./views/Perfil";
import Ajustes from "./views/Ajustes";
import RutaProtegida from "./components/rutas/RutaProtegida";
import Pagina404 from "./views/Pagina404";
import Dashboard from './views/Dashboard.jsx';
import { supabase } from "./database/supabaseconfig";

const AppContent = () => {
  const location = useLocation();
  const esLogin = location.pathname === "/login";

  const aplicarConfiguracionVisual = async () => {
    try {
      const { data, error } = await supabase
        .from("configuracion_sistema")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        // Inyectar variables CSS dinámicamente en el :root
        document.documentElement.style.setProperty('--accent', data.color_primario);
        document.documentElement.style.setProperty('--text-muted', data.color_secundario);
        document.documentElement.style.setProperty('--bg-main', data.color_fondo);
      }
    } catch (err) {
      console.error("Error al aplicar configuración visual:", err);
    }
  };

  useEffect(() => {
    aplicarConfiguracionVisual();

    // Escuchar cambios en tiempo real
    window.addEventListener("system-config-changed", aplicarConfiguracionVisual);
    return () => {
      window.removeEventListener("system-config-changed", aplicarConfiguracionVisual);
    };
  }, []);

  return (
    <>
      <Encabezado />
      <main className={esLogin ? "" : "margen-superior-main"}>
        <Routes>
          {/* Pública */}
          <Route path="/login" element={<Login />} />

          {/* Protegidas */}
          <Route path="/" element={<RutaProtegida><Inicio /></RutaProtegida>} />
          <Route path="/dashboard" element={<RutaProtegida><Dashboard/></RutaProtegida>} />
          <Route path="/empleados" element={<RutaProtegida><Empleados /></RutaProtegida>} />
          <Route path="/incidencias" element={<RutaProtegida><Incidencias /></RutaProtegida>} />
          <Route path="/catalogo" element={<RutaProtegida><Catalogo /></RutaProtegida>} />
          <Route path="/asistencias" element={<RutaProtegida><Asistencias /></RutaProtegida>} />
          <Route path="/turnos" element={<RutaProtegida><Turnos /></RutaProtegida>} />
          <Route path="/usuarios" element={<RutaProtegida><Usuarios /></RutaProtegida>} />
          <Route path="/perfil" element={<RutaProtegida><Perfil /></RutaProtegida>} />
          <Route path="/perfil/:id" element={<RutaProtegida><Perfil /></RutaProtegida>} />
          <Route path="/ajustes" element={<RutaProtegida><Ajustes /></RutaProtegida>} />

          {/* 404 */}
          <Route path="*" element={<Pagina404 />} />
        </Routes>
      </main>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;