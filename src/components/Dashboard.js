import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Alert, Badge, ListGroup } from 'react-bootstrap';
import './Dashboard.css';

const Dashboard = () => {
    const [estadisticas, setEstadisticas] = useState({
        totalAlumnos: 0,
        promedioGeneral: 0,
        mejoresAlumnos: [],
        alumnosEnRiesgo: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función para cargar los datos y calcular estadísticas
    const cargarEstadisticas = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/alumnos/');
            const alumnos = response.data;

            // Calcular estadísticas
            const totalAlumnos = alumnos.length;
            
            // Calcular promedio general
            const sumaPromedios = alumnos.reduce((suma, alumno) => suma + (alumno.promedio || 0), 0);
            const promedioGeneral = totalAlumnos > 0 ? sumaPromedios / totalAlumnos : 0;

            // Ordenar alumnos por promedio (mejores primero)
            const alumnosOrdenados = [...alumnos].sort((a, b) => (b.promedio || 0) - (a.promedio || 0));
            
            // Top 3 mejores alumnos
            const mejoresAlumnos = alumnosOrdenados.slice(0, 3);
            
            // Alumnos en riesgo (promedio < 3.0)
            const alumnosEnRiesgo = alumnos.filter(alumno => (alumno.promedio || 0) < 3.0);

            setEstadisticas({
                totalAlumnos,
                promedioGeneral,
                mejoresAlumnos,
                alumnosEnRiesgo
            });
        } catch (err) {
            setError('Error al cargar las estadísticas');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarEstadisticas();
    }, []);

    // Función para obtener el color del badge según el promedio
    const getBadgeVariant = (promedio) => {
        if (promedio >= 4.5) return 'success';
        if (promedio >= 4.0) return 'primary';
        if (promedio >= 3.5) return 'info';
        if (promedio >= 3.0) return 'warning';
        return 'danger';
    };

    if (loading) {
        return (
            <div className="text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p>Cargando estadísticas...</p>
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <div className="mb-5">
            <h1 className="mb-4 dashboard-title">Gestión de Alumnos</h1>
            
            {/* Tarjetas de estadísticas principales */}
            <Row className="mb-4">
                <Col md={3}>
                    <Card className="text-center h-100 shadow-lg stat-card dashboard-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                        <Card.Body>
                            <h2 className="display-4 stat-icon">
                                <i className="fas fa-users"></i>
                            </h2>
                            <Card.Title>Total Alumnos</Card.Title>
                            <h3 className="display-6 stat-number">{estadisticas.totalAlumnos}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col md={3}>
                    <Card className="text-center h-100 shadow-lg stat-card dashboard-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                        <Card.Body>
                            <h2 className="display-4 stat-icon">
                                <i className="fas fa-chart-line"></i>
                            </h2>
                            <Card.Title>Promedio General</Card.Title>
                            <h3 className="display-6 stat-number">{estadisticas.promedioGeneral.toFixed(2)}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col md={3}>
                    <Card className="text-center h-100 shadow-lg stat-card dashboard-card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                        <Card.Body>
                            <h2 className="display-4 stat-icon">
                                <i className="fas fa-trophy"></i>
                            </h2>
                            <Card.Title>Mejores Estudiantes</Card.Title>
                            <h3 className="display-6 stat-number">{estadisticas.mejoresAlumnos.length}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col md={3}>
                    <Card className="text-center h-100 shadow-lg stat-card dashboard-card" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
                        <Card.Body>
                            <h2 className="display-4 stat-icon">
                                <i className="fas fa-exclamation-triangle"></i>
                            </h2>
                            <Card.Title>Necesitan Apoyo</Card.Title>
                            <h3 className="display-6 stat-number">{estadisticas.alumnosEnRiesgo.length}</h3>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Sección de detalles */}
            <Row>
                {/* Top 3 Mejores Alumnos */}
                <Col md={6}>
                    <Card className="mb-4 shadow-lg dashboard-card">
                        <Card.Header>
                            <h4>Top 3 Mejores Estudiantes</h4>
                        </Card.Header>
                        <Card.Body>
                            {estadisticas.mejoresAlumnos.length > 0 ? (
                                <ListGroup variant="flush">
                                    {estadisticas.mejoresAlumnos.map((alumno, index) => (
                                        <ListGroup.Item key={alumno.id} className="d-flex justify-content-between align-items-center list-item-basic">
                                            <div>
                                                <strong>#{index + 1} {alumno.nombre}</strong>
                                                <br />
                                                <small className="text-muted">Documento: {alumno.numero_documento}</small>
                                            </div>
                                            <Badge bg={getBadgeVariant(alumno.promedio)} pill className="badge-basic">
                                                {alumno.promedio ? alumno.promedio.toFixed(2) : 'N/A'}
                                            </Badge>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <p className="text-muted">No hay alumnos registrados.</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Alumnos que necesitan apoyo */}
                <Col md={6}>
                    <Card className="mb-4 shadow-lg dashboard-card">
                        <Card.Header>
                            <h4>Estudiantes que Necesitan Apoyo</h4>
                        </Card.Header>
                        <Card.Body>
                            {estadisticas.alumnosEnRiesgo.length > 0 ? (
                                <ListGroup variant="flush">
                                    {estadisticas.alumnosEnRiesgo.map((alumno) => (
                                        <ListGroup.Item key={alumno.id} className="d-flex justify-content-between align-items-center list-item-basic">
                                            <div>
                                                <strong>{alumno.nombre}</strong>
                                                <br />
                                                <small className="text-muted">Documento: {alumno.numero_documento}</small>
                                            </div>
                                            <Badge bg="danger" pill>
                                                {alumno.promedio ? alumno.promedio.toFixed(2) : 'N/A'}
                                            </Badge>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <Alert variant="success">
                                    ¡Excelente! Todos los estudiantes tienen un rendimiento satisfactorio.
                                </Alert>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Información adicional */}
            <Card className="shadow-lg border-0 dashboard-card">
                <Card.Header>
                    <h4>Resumen del Rendimiento</h4>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={4}>
                            <div className="text-center stat-card">
                                <h5>Rendimiento Excelente</h5>
                                <h3 className="text-success stat-number">
                                    {estadisticas.mejoresAlumnos.filter(a => a.promedio >= 4.5).length}
                                </h3>
                                <div style={{ marginTop: '20px' }}>
                                    <small className="text-muted">Promedio ≥ 4.5</small>
                                </div>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="text-center stat-card">
                                <h5>Rendimiento Bueno</h5>
                                <h3 className="text-primary stat-number">
                                    {estadisticas.mejoresAlumnos.filter(a => a.promedio >= 4.0 && a.promedio < 4.5).length}
                                </h3>
                                <div style={{ marginTop: '20px' }}>
                                    <small className="text-muted">Promedio 4.0 - 4.4</small>
                                </div>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="text-center stat-card">
                                <h5>Necesitan Apoyo</h5>
                                <h3 className="text-danger stat-number">
                                    {estadisticas.alumnosEnRiesgo.length}
                                </h3>
                                <div style={{ marginTop: '20px' }}>
                                    <small className="text-muted">Promedio &lt; 3.0</small>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Dashboard;
