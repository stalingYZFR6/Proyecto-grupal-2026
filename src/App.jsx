import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Encabezado from "./components/navegacion/Encabezado";
import Inicio from "./views/Inicio";
import Empleados from './views/Empleado';
import Incidencias from './views/Incidencias';
import Catalogo from "./views/Catalogo";
import Asistencias from "./views/RegistroAsistencia.jsx";
import Turnos from './views/Turnos';
import Usuarios from './views/Usuarios';
import MiPerfil from './views/MiPerfil';
import Login from "./views/Login";
import RutaProtegida from "./components/rutas/RutaProtegida";
import RutaAdmin from "./components/rutas/RutaAdmin";
import Pagina404 from "./views/Pagina404";
import Dashboard from './views/Dashboard.jsx';

const App = () => {
  return (
    <Router>
      <Encabezado />
      <main className="margen-superior-main">
        <Routes>

          {/* Pública */}
          <Route path="/login" element={<Login />} />

          {/* Protegidas (Cualquier rol activo) */}
          <Route path="/" element={<RutaProtegida><Inicio /></RutaProtegida>} />
          <Route path="/perfil" element={<RutaProtegida><MiPerfil /></RutaProtegida>} />
          <Route path="/asistencias" element={<RutaProtegida><Asistencias /></RutaProtegida>} />

          {/* Administrativas (Solo Admin) */}
          <Route path="/dashboard" element={<RutaAdmin><Dashboard/></RutaAdmin>} />
          <Route path="/empleados" element={<RutaAdmin><Empleados /></RutaAdmin>} />
          <Route path="/usuarios" element={<RutaAdmin><Usuarios /></RutaAdmin>} />
          <Route path="/incidencias" element={<RutaAdmin><Incidencias /></RutaAdmin>} />
          <Route path="/catalogo" element={<RutaAdmin><Catalogo /></RutaAdmin>} />
          <Route path="/turnos" element={<RutaAdmin><Turnos /></RutaAdmin>} />

          {/* 404 */}
          <Route path="*" element={<Pagina404 />} />

        </Routes>
      </main>
    </Router>
  );
}
export default App;