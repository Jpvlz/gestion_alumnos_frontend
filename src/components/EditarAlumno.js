import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import './EditarAlumno.css';

// Componente EditarAlumno: permite editar los datos de un alumno existente
const EditarAlumno = () => {
    // Obtiene el parámetro `id` de la URL
    const { id } = useParams();


    // Hook para redirigir al usuario a otra ruta
    const navigate = useNavigate();


    // Estado inicial del formulario con los datos del alumno
    const [alumno, setAlumno] = useState({
        nombre: '', // Nombre del alumno
        numero_documento: '', // Número de documento del alumno
        nota1: '', // Nota 1 del alumno
        nota2: '', // Nota 2 del alumno
        nota3: '', // Nota 3 del alumno
    });


    // Estado para manejar la carga de datos
    const [loading, setLoading] = useState(true);


    // Estado para manejar errores al cargar o actualizar datos
    const [error, setError] = useState(null);


    // Estado para mostrar alertas (éxito o error)
    const [showAlert, setShowAlert] = useState(null);


    // Hook useEffect: carga los datos del alumno al montar el componente
    useEffect(() => {
        const fetchAlumno = async () => {
            setLoading(true); // Indica que los datos están cargando
            setError(null); // Reinicia el estado de error
            try {
                // Realiza una solicitud GET para obtener los datos del alumno
                const response = await axios.get(`http://127.0.0.1:8000/api/alumnos/${id}/`);
                setAlumno(response.data); // Actualiza el estado con los datos del alumno
            } catch (err) {
                // Maneja errores al cargar los datos
                setError(err.message || 'Error al cargar el alumno.');
            } finally {
                setLoading(false); // Finaliza el estado de carga
            }
        };


        fetchAlumno();
    }, [id]); // Se ejecuta cuando cambia el `id`


    // Maneja los cambios en los campos del formulario
    const handleChange = (e) => {
        // Actualiza el estado del formulario con el valor ingresado
        setAlumno({ ...alumno, [e.target.name]: e.target.value });
    };


    // Maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario
        try {
            // Realiza una solicitud PUT para actualizar los datos del alumno
            await axios.put(`http://127.0.0.1:8000/api/alumnos/${id}/`, alumno);
            // Muestra una alerta de éxito
            setShowAlert({ variant: 'success', message: 'Alumno actualizado exitosamente!' });
            // Redirige al usuario a la lista de alumnos después de 1.5 segundos
            setTimeout(() => navigate('/alumnos'), 1500);
        } catch (err) {
            // Maneja errores al actualizar los datos
            console.error("Error al actualizar alumno:", err);
            console.error("Error response:", err.response?.data);
            console.error("Error status:", err.response?.status);
            
            let errorMessage = 'Error al actualizar el alumno.';
            
            if (err.response?.data) {
                // Manejo específico de errores de validación
                if (typeof err.response.data === 'object') {
                    const errors = err.response.data;
                    
                    // Error específico para número de documento duplicado
                    if (errors.numero_documento) {
                        errorMessage = `❌ El número de documento "${alumno.numero_documento}" ya está registrado por otro alumno. Por favor, use un número diferente.`;
                    }
                    // Error específico para nombre
                    else if (errors.nombre) {
                        errorMessage = `❌ Error en el nombre: ${errors.nombre.join(', ')}`;
                    }
                    // Errores en las notas
                    else if (errors.nota1 || errors.nota2 || errors.nota3) {
                        const notaErrors = [];
                        if (errors.nota1) notaErrors.push(`Nota 1: ${errors.nota1.join(', ')}`);
                        if (errors.nota2) notaErrors.push(`Nota 2: ${errors.nota2.join(', ')}`);
                        if (errors.nota3) notaErrors.push(`Nota 3: ${errors.nota3.join(', ')}`);
                        errorMessage = `❌ Error en las notas: ${notaErrors.join(', ')}`;
                    }
                    // Otros errores
                    else {
                        errorMessage = `❌ ${Object.values(errors).flat().join(', ')}`;
                    }
                } else {
                    errorMessage = `❌ ${err.response.data}`;
                }
            } else if (err.message) {
                errorMessage = `❌ ${err.message}`;
            }
            
            setShowAlert({ variant: 'danger', message: errorMessage });
        }
    };


    // Muestra un mensaje de carga mientras se obtienen los datos
    if (loading) {
        return <div>Cargando información del alumno...</div>;
    }


    // Muestra un mensaje de error si ocurre un problema al cargar los datos
    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }


    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    {/* Título del formulario con animación */}
                    <h2 className="text-center mb-4 editar-alumno-title">Editar Alumno</h2>

                    {/* Card contenedor del formulario con animación */}
                    <Card className="shadow-lg border-0 editar-alumno-card">
                        <Card.Body className="p-4">
                            {/* Alerta condicional: se muestra si hay un mensaje en showAlert */}
                            {showAlert && (
                                <Alert variant={showAlert.variant} onClose={() => setShowAlert(null)} dismissible>
                                    {showAlert.message}
                                </Alert>
                            )}

                            {/* Formulario para editar los datos del alumno */}
                            <Form onSubmit={handleSubmit}>
                {/* Campo para el nombre del alumno */}
                <Form.Group className="mb-3">
                    <Form.Label className="form-label-basic">Nombre</Form.Label>
                    <Form.Control
                        type="text"
                        name="nombre"
                        value={alumno.nombre}
                        onChange={handleChange}
                        required
                        className="form-control-basic"
                    />
                </Form.Group>


                {/* Campo para el número de documento */}
                <Form.Group className="mb-3">
                    <Form.Label className="form-label-basic">Número de Documento</Form.Label>
                    <Form.Control
                        type="text"
                        name="numero_documento"
                        value={alumno.numero_documento}
                        onChange={handleChange}
                        required
                        className="form-control-basic"
                    />
                </Form.Group>


                {/* Campo para la Nota 1 */}
                <Form.Group className="mb-3">
                    <Form.Label className="form-label-basic">Nota 1</Form.Label>
                    <Form.Control
                        type="number"
                        step="0.01"
                        name="nota1"
                        value={alumno.nota1}
                        onChange={handleChange}
                        required
                        className="form-control-basic"
                    />
                </Form.Group>


                {/* Campo para la Nota 2 */}
                <Form.Group className="mb-3">
                    <Form.Label className="form-label-basic">Nota 2</Form.Label>
                    <Form.Control
                        type="number"
                        step="0.01"
                        name="nota2"
                        value={alumno.nota2}
                        onChange={handleChange}
                        required
                        className="form-control-basic"
                    />
                </Form.Group>


                {/* Campo para la Nota 3 */}
                <Form.Group className="mb-3">
                    <Form.Label className="form-label-basic">Nota 3</Form.Label>
                    <Form.Control
                        type="number"
                        step="0.01"
                        name="nota3"
                        value={alumno.nota3}
                        onChange={handleChange}
                        required
                        className="form-control-basic"
                    />
                </Form.Group>


                {/* Botón para enviar el formulario con animación */}
                <Button variant="primary" type="submit" className="btn-actualizar-basic">Guardar Cambios</Button>


                {/* Enlace para cancelar y volver a la página principal */}
                <Link to="/" className="btn btn-danger ms-2 btn-cancelar-basic">Cancelar</Link>
            </Form>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    );
};


export default EditarAlumno;
