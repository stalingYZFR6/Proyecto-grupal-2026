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

const AppContent = ({ config, recargarConfig }) => {
  const location = useLocation();
  const esLogin = location.pathname === "/login";

  return (
    <>
      <Encabezado config={config} />
      <main className={esLogin ? "" : "margen-superior-main"}>
        <Routes>
          {/* Pública */}
          <Route path="/login" element={<Login config={config} />} />

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
          <Route path="/ajustes" element={<RutaProtegida><Ajustes config={config} recargarConfig={recargarConfig} /></RutaProtegida>} />

          {/* 404 */}
          <Route path="*" element={<Pagina404 />} />
        </Routes>
      </main>
    </>
  );
};

const App = () => {
  const [config, setConfig] = useState({
    nombre_empresa: "AssisTech",
    url_logo: null,
    color_fondo: "#0f172a",
    color_primario: "#1e293b",
    color_secundario: "#38bdf8",
    es_tema_personalizado: false
  });

  const cargarConfiguracion = async () => {
    try {
      const { data, error } = await supabase
        .from("configuracion_sistema")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setConfig(data);
        // Aplicar variables CSS dinámicas
        document.documentElement.style.setProperty('--custom-bg-main', data.color_fondo);
        document.documentElement.style.setProperty('--custom-bg-card', data.color_primario);
        document.documentElement.style.setProperty('--custom-accent', data.color_secundario);
      }
    } catch (err) {
      console.error("Error cargando configuración de marca blanca:", err);
    }
  };

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  return (
    <Router>
      <AppContent config={config} recargarConfig={cargarConfiguracion} />
    </Router>
  );
}

export default App;