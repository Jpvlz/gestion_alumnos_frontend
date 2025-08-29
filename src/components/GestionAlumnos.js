import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Table, Button, Alert, Modal, Card } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './GestionAlumnos.css';

// Componente GestionAlumnos: muestra una lista de alumnos con opciones para editar y eliminar
const GestionAlumnos = () => {
    // Estado para almacenar la lista de alumnos
    const [alumnos, setAlumnos] = useState([]);


    // Estado para manejar la carga de datos
    const [loading, setLoading] = useState(true);


    // Estado para manejar errores al cargar los datos
    const [error, setError] = useState(null);


    // Estado para mostrar alertas al eliminar un alumno
    const [deleteAlert, setDeleteAlert] = useState(null);

    // Estados para la modal de confirmación de eliminación
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [alumnoToDelete, setAlumnoToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);


    // Tamaño de los iconos para las acciones
    const iconSize = 20;


    // Hook useEffect: carga la lista de alumnos al montar el componente
    useEffect(() => {
        fetchAlumnos(); // Llama a la función para obtener los alumnos
    }, []);


    // Función para obtener la lista de alumnos desde la API
    const fetchAlumnos = async () => {
        setLoading(true); // Indica que los datos están cargando
        setError(null); // Reinicia el estado de error
        try {
            // Realiza una solicitud GET para obtener los alumnos
            const response = await axios.get('http://127.0.0.1:8000/api/alumnos/');
            setAlumnos(response.data); // Actualiza el estado con los datos obtenidos
        } catch (err) {
            // Maneja errores al cargar los datos
            setError(err.message || 'Error al obtener alumnos.');
        } finally {
            setLoading(false); // Finaliza el estado de carga
        }
    };


    // Función para mostrar la modal de confirmación de eliminación
    const handleDeleteClick = (alumno) => {
        setAlumnoToDelete(alumno);
        setShowDeleteModal(true);
    };

    // Función para cancelar la eliminación
    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setAlumnoToDelete(null);
        setIsDeleting(false);
    };

    // Función para confirmar y ejecutar la eliminación
    const handleConfirmDelete = async () => {
        if (!alumnoToDelete) return;
        
        setIsDeleting(true);
        try {
            // Realiza una solicitud DELETE para eliminar el alumno
            await axios.delete(`http://127.0.0.1:8000/api/alumnos/${alumnoToDelete.id}/`);
            
            // Muestra una alerta de éxito
            setDeleteAlert({ 
                variant: 'success', 
                message: `✅ Alumno "${alumnoToDelete.nombre}" eliminado exitosamente!` 
            });
            
            // Recarga la lista de alumnos después de eliminar
            fetchAlumnos(); 
            
            // Cierra la modal
            setShowDeleteModal(false);
            setAlumnoToDelete(null);
            
            // Oculta la alerta después de 3 segundos
            setTimeout(() => setDeleteAlert(null), 3000); 
        } catch (err) {
            // Maneja errores al eliminar el alumno
            console.error("Error al eliminar alumno:", err);
            
            let errorMessage = 'Error al eliminar el alumno.';
            if (err.response?.data) {
                if (typeof err.response.data === 'object') {
                    errorMessage = `❌ ${Object.values(err.response.data).flat().join(', ')}`;
                } else {
                    errorMessage = `❌ ${err.response.data}`;
                }
            } else if (err.message) {
                errorMessage = `❌ ${err.message}`;
            }
            
            setDeleteAlert({ variant: 'danger', message: errorMessage });
            
            // Oculta la alerta después de 3 segundos
            setTimeout(() => setDeleteAlert(null), 3000); 
        } finally {
            setIsDeleting(false);
        }
    };


    // Muestra un mensaje de carga mientras se obtienen los datos
    if (loading) {
        return <div>Cargando alumnos...</div>;
    }


    // Muestra un mensaje de error si ocurre un problema al cargar los datos
    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }


    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12">
                    {/* Título de la página con animación */}
                    <h2 className="text-center mb-4 gestion-title">Gestión de Alumnos</h2>

                    {/* Card contenedor principal */}
                    <Card className="shadow-lg border-0 gestion-card">
                        <Card.Body className="p-4">
                            {/* Botón para crear un nuevo alumno */}
                            <Link to="/crear" className="btn btn-primary mb-3 btn-crear-alumno">Crear Nuevo Alumno</Link>

                            {/* Alerta condicional: se muestra si hay un mensaje en deleteAlert */}
                            {deleteAlert && <Alert variant={deleteAlert.variant}>{deleteAlert.message}</Alert>}

                            {/* Tabla para mostrar la lista de alumnos */}
                            <Table striped bordered hover className="table-sm table-compact table-basic">
                                <thead>
                                    <tr>
                                        <th style={{width: '4%'}}>ID</th>
                                        <th style={{width: '40%'}}>Nombre</th>
                                        <th style={{width: '15%'}}>Documento</th>
                                        <th style={{width: '9%'}}>Nota 1</th>
                                        <th style={{width: '9%'}}>Nota 2</th>
                                        <th style={{width: '9%'}}>Nota 3</th>
                                        <th style={{width: '8%'}}>Promedio</th>
                                        <th style={{width: '6%'}}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Mapea los alumnos y genera una fila para cada uno */}
                                    {alumnos.map(alumno => (
                                        <tr key={alumno.id}>
                                            <td>{alumno.id}</td>
                                            <td>{alumno.nombre}</td>
                                            <td>{alumno.numero_documento}</td>
                                            <td>{alumno.nota1}</td>
                                            <td>{alumno.nota2}</td>
                                            <td>{alumno.nota3}</td>
                                            <td>{alumno.promedio ? alumno.promedio.toFixed(2) : 'N/A'}</td>
                                            <td className="d-flex gap-2 actions-cell"> {/* Usa flex para alinear los iconos */}
                                                {/* Botón para editar el alumno */}
                                                <Link to={`/editar/${alumno.id}`} className="btn btn-warning btn-sm btn-warning-basic">
                                                    <FaEdit size={iconSize} /> {/* Icono de editar */}
                                                </Link>
                                                {/* Botón para eliminar el alumno */}
                                                <Button variant="danger" size="sm" className="btn-danger-basic" onClick={() => handleDeleteClick(alumno)}>
                                                    <FaTrash size={iconSize} /> {/* Icono de eliminar */}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            {/* Modal de confirmación para eliminar */}
                            <Modal show={showDeleteModal} onHide={handleCancelDelete} centered>
                                <Modal.Header closeButton>
                                    <Modal.Title className="text-danger">
                                        <FaTrash className="me-2" />
                                        Confirmar Eliminación
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    {alumnoToDelete && (
                                        <div>
                                            <p className="mb-3">
                                                <strong>¿Estás seguro de que deseas eliminar este alumno?</strong>
                                            </p>
                                            <div className="alert alert-light border">
                                                <strong>Datos del alumno:</strong>
                                                <br />
                                                <strong>Nombre:</strong> {alumnoToDelete.nombre}
                                                <br />
                                                <strong>Documento:</strong> {alumnoToDelete.numero_documento}
                                                <br />
                                                <strong>Promedio:</strong> {alumnoToDelete.promedio ? alumnoToDelete.promedio.toFixed(2) : 'N/A'}
                                            </div>
                                            <p className="text-danger mb-0">
                                                <strong>⚠️ Esta acción no se puede deshacer.</strong>
                                            </p>
                                        </div>
                                    )}
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button 
                                        variant="primary" 
                                        onClick={handleCancelDelete}
                                        disabled={isDeleting}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button 
                                        variant="danger" 
                                        onClick={handleConfirmDelete}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Eliminando...
                                            </>
                                        ) : (
                                            <>Sí, Eliminar</>
                                        )}
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    );
};


export default GestionAlumnos;
