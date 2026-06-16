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
import Login from "./views/Login";
import RutaProtegida from "./components/rutas/RutaProtegida";
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

          {/* Protegidas */}
          <Route path="/" element={<RutaProtegida><Inicio /></RutaProtegida>} />
          <Route path="/dashboard" element={<RutaProtegida><Dashboard/></RutaProtegida>} />
          <Route path="/empleados" element={<RutaProtegida><Empleados /></RutaProtegida>} />
          <Route path="/incidencias" element={<RutaProtegida><Incidencias /></RutaProtegida>} />
          <Route path="/catalogo" element={<RutaProtegida><Catalogo /></RutaProtegida>} />
          <Route path="/asistencias" element={<RutaProtegida><Asistencias /></RutaProtegida>} />
          <Route path="/turnos" element={<RutaProtegida><Turnos /></RutaProtegida>} />
          <Route path="/usuarios" element={<RutaProtegida><Usuarios /></RutaProtegida>} />

          {/* 404 */}
          <Route path="*" element={<Pagina404 />} />

        </Routes>
      </main>
    </Router>
  );
}
export default App;