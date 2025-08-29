import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import GestionAlumnos from './components/GestionAlumnos';
import CrearAlumno from './components/CrearAlumno';
import EditarAlumno from './components/EditarAlumno';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Nav, Navbar } from 'react-bootstrap';
import './App.css';

// Componente de navegación con resaltado activo
function Navigation() {
    const location = useLocation();
    
    // Función para determinar si un enlace está activo
    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path === '/alumnos' && (location.pathname === '/alumnos' || location.pathname.startsWith('/editar'))) return true;
        if (path === '/crear' && location.pathname === '/crear') return true;
        return false;
    };

    return (
        <Navbar bg="light" expand="lg" className="navbar-basic">
            <Container>
                <Navbar.Brand 
                    as={Link} 
                    to="/" 
                    className="navbar-brand-basic"
                >
                    Gestión de Alumnos
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link 
                            as={Link} 
                            to="/alumnos"
                            className={`nav-link-basic ${isActive('/alumnos') ? 'nav-link-active' : ''}`}
                        >
                            Gestión de Alumnos
                        </Nav.Link>
                        <Nav.Link 
                            as={Link} 
                            to="/crear"
                            className={`nav-link-basic ${isActive('/crear') ? 'nav-link-active' : ''}`}
                        >
                            Crear Alumno
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

function App() {
    return (
        <Router>
            <Navigation />
            <Container className="mt-3" style={{ minHeight: 'calc(100vh - 120px)' }}>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/alumnos" element={<GestionAlumnos />} />
                    <Route path="/crear" element={<CrearAlumno />} />
                    <Route path="/editar/:id" element={<EditarAlumno />} /> {/* Nueva ruta para editar */}
                </Routes>
            </Container>
            
            {/* Footer */}
                  {/* Footer */}
      <footer className="footer mt-auto py-2 bg-dark text-white border-top border-info">
        <div className="container">
          <div className="text-center">
            <p className="mb-0 text-muted small">
              &copy; 2025 Sistema de Gestión de Alumnos
            </p>
          </div>
        </div>
      </footer>
        </Router>
    );
}


export default App;
