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

  // Función para detectar si un color hexadecimal es claro o oscuro
  const esColorClaro = (hex) => {
    if (!hex) return false;
    const c = hex.substring(1);      // Eliminar el #
    const rgb = parseInt(c, 16);     // Convertir a decimal
    const r = (rgb >> 16) & 0xff;    // Extraer rojo
    const g = (rgb >>  8) & 0xff;    // Extraer verde
    const b = (rgb >>  0) & 0xff;    // Extraer azul
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // Luminosidad relativa
    return luma > 128;
  };

  const aplicarConfiguracionVisual = async () => {
    try {
      const { data, error } = await supabase
        .from("configuracion_sistema")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const root = document.documentElement;

        // Inyectar variables principales
        root.style.setProperty('--accent', data.color_primario);
        root.style.setProperty('--text-muted', data.color_secundario);
        root.style.setProperty('--bg-main', data.color_fondo);

        // Motor de contraste inteligente: Adaptar textos y tarjetas según el fondo
        if (esColorClaro(data.color_fondo)) {
          root.style.setProperty('--text-main', '#1e293b');
          root.style.setProperty('--bg-card', '#ffffff');
          root.style.setProperty('--bg-light', '#f1f5f9');
          root.style.setProperty('--border-color', '#e2e8f0');
          root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.7)');
        } else {
          root.style.setProperty('--text-main', '#f1f5f9');
          root.style.setProperty('--bg-card', '#1e293b');
          root.style.setProperty('--bg-light', '#334155');
          root.style.setProperty('--border-color', '#334155');
          root.style.setProperty('--glass-bg', 'rgba(15, 23, 42, 0.8)');
        }
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