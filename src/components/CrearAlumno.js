import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import './CrearAlumno.css';

// Componente CrearAlumno: permite crear un nuevo alumno enviando los datos a una API REST
const CrearAlumno = () => {
    // Estado inicial del formulario
    const [alumno, setAlumno] = useState({
        nombre: '', // Nombre del alumno
        numero_documento: '', // Número de documento del alumno
        nota1: '', // Nota 1 del alumno
        nota2: '', // Nota 2 del alumno
        nota3: '', // Nota 3 del alumno
    });


    // Hook para redirigir al usuario a otra ruta
    const navigate = useNavigate();


    // Estado para mostrar alertas (éxito o error)
    const [showAlert, setShowAlert] = useState(null);


    // Maneja los cambios en los campos del formulario
    const handleChange = (e) => {
        // Actualiza el estado del formulario con el valor ingresado
        setAlumno({ ...alumno, [e.target.name]: e.target.value });
    };


    // Maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario
        try {
            // Envía los datos del formulario a la API
            await axios.post('http://127.0.0.1:8000/api/alumnos/', alumno);
            // Muestra una alerta de éxito
            setShowAlert({ variant: 'success', message: 'Alumno creado exitosamente!' });
            // Redirige al usuario a la lista de alumnos después de 1.5 segundos
            setTimeout(() => navigate('/alumnos'), 1500);
        } catch (error) {
            // Muestra una alerta de error si ocurre un problema
            console.error("Error al crear alumno:", error);
            console.error("Error response:", error.response?.data);
            console.error("Error status:", error.response?.status);
            
            let errorMessage = 'Error al crear el alumno.';
            
            if (error.response?.data) {
                // Manejo específico de errores de validación
                if (typeof error.response.data === 'object') {
                    const errors = error.response.data;
                    
                    // Error específico para número de documento duplicado
                    if (errors.numero_documento) {
                        errorMessage = `❌ El número de documento "${alumno.numero_documento}" ya está registrado. Por favor, use un número diferente.`;
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
                    errorMessage = `❌ ${error.response.data}`;
                }
            } else if (error.message) {
                errorMessage = `❌ ${error.message}`;
            }
            
            setShowAlert({ variant: 'danger', message: errorMessage });
        }
    };


    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    {/* Título del formulario */}
                    <h2 className="text-center mb-4 crear-alumno-title">Crear Nuevo Alumno</h2>

                    {/* Card contenedor del formulario */}
                    <Card className="shadow-lg border-0 crear-alumno-card">
                        <Card.Body className="p-4">
                            {/* Alerta condicional: se muestra si hay un mensaje en showAlert */}
                            {showAlert && (
                                <Alert variant={showAlert.variant} onClose={() => setShowAlert(null)} dismissible>
                                    {showAlert.message}
                                </Alert>
                            )}

                            {/* Formulario para crear un nuevo alumno */}
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


                {/* Botón para enviar el formulario */}
                <Button variant="primary" type="submit" className="btn-crear-basic">Guardar</Button>


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


export default CrearAlumno;
