
import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Table } from 'react-bootstrap';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '../../database/supabaseconfig';

const ChatIA = ({ mostrar, onCerrar }) => {
    const [mensajes, setMensajes] = useState([]);
    const [entrada, setEntrada] = useState('');
    const [cargando, setCargando] = useState(false);

    const finChatRef = useRef(null);

    const genAIRef = useRef(
        new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)
    );

    const chatRef = useRef(null);

    const contextoBaseDatos = `
Sistema de control de asistencia.

Tablas:

empleado(
 id_empleado,
 nombre,
 apellido,
 cedula,
 correo,
 telefono,
 direccion,
 url_imagen
)

turnos(
 id_turno,
 tipo_turno,
 hora_inicio,
 hora_fin
)

Incidencias(
 id_incidencia,
 tipo_incidencia,
 descripcion,
 fecha_incidencia
)

asistencias(
 id_asistencia,
 id_empleado,
 id_turno,
 id_incidencia,
 id_jornada,
 estado_asistencia,
 hora_entrada,
 hora_salida,
 horas_trabajadas,
 estado_salida,
 horas_extra,
 horas_extras,
 observacion,
 observacion_salida,
 fecha_registro
)

jornadas_asistencia(
 id_jornada,
 fecha,
 estado,
 dia_semana,
 fecha_cierre,
 total_empleados,
 total_completados,
 total_salieron_antes,
 total_horas_extras,
 total_horas_trabajadas
)

usuarios(
 id_usuario,
 id_empleado,
 id_auth,
 rol,
 activo,
 created_at
)

Relaciones:
asistencias.id_empleado=empleado.id_empleado
asistencias.id_turno=turnos.id_turno
asistencias.id_incidencia=Incidencias.id_incidencia
asistencias.id_jornada=jornadas_asistencia.id_jornada
usuarios.id_empleado=empleado.id_empleado
`;

    useEffect(() => {
        const iniciarChat = async () => {
            try {
                const modelo = genAIRef.current.getGenerativeModel({
                    model: 'gemini-2.5-flash'
                });

                chatRef.current = modelo.startChat({
                    history: [
                        {
                            role: 'user',
                            parts: [
                                {
                                    text: `
Eres un generador de consultas PostgreSQL.

${contextoBaseDatos}

Reglas:

- Comprende errores ortográficos.
- Usa SOLO tablas y columnas definidas arriba.
- NO inventes nombres.
- Genera únicamente consultas SELECT.
- Nunca INSERT, UPDATE, DELETE, DROP, ALTER ni TRUNCATE.
- Utiliza JOIN cuando sea necesario.
- Sin punto y coma final.
- Sin markdown.
- Sin explicaciones fuera del JSON.
- Responde únicamente con JSON válido.

Formato obligatorio:

{
 "explicacion":"texto",
 "consulta_sql":"SELECT ...",
 "columnas":["columna1","columna2"]
}
`
                                }
                            ]
                        },
                        {
                            role: 'model',
                            parts: [{ text: 'Entendido.' }]
                        }
                    ]
                });
            } catch (error) {
                console.error('Error inicializando Gemini:', error);
            }
        };

        iniciarChat();
    }, []);

    const enviarConsulta = async () => {
        if (!entrada.trim() || !chatRef.current) return;

        const consultaActual = entrada.trim();

        setMensajes(prev => [
            ...prev,
            {
                tipo: 'usuario',
                contenido: consultaActual
            }
        ]);

        setEntrada('');
        setCargando(true);

        try {
            const resultado = await chatRef.current.sendMessage(consultaActual);

            let texto = resultado.response.text().trim();

            texto = texto
                .replace(/```json/g, '')
                .replace(/```/g, '')
                .trim();

            const match = texto.match(/\{[\s\S]*\}/);

            if (!match) {
                throw new Error('No se encontró JSON válido');
            }

            const respuestaIA = JSON.parse(match[0]);

            let sqlLimpio = respuestaIA.consulta_sql
                ?.trim()
                ?.replace(/;\s*$/, '');

            if (!sqlLimpio?.toUpperCase().startsWith('SELECT')) {
                throw new Error('Solo se permiten consultas SELECT');
            }

            const { data, error } = await supabase.rpc(
                'ejecutar_consulta_segura',
                {
                    query_sql: sqlLimpio
                }
            );

            if (error) {
                throw error;
            }

            const datosExtraidos = data
                ? data.map(item => item.datos)
                : [];

            setMensajes(prev => [
                ...prev,
                {
                    tipo: 'ia',
                    explicacion:
                        respuestaIA.explicacion ||
                        'Consulta ejecutada correctamente',
                    columnas:
                        respuestaIA.columnas?.length > 0
                            ? respuestaIA.columnas
                            : datosExtraidos.length > 0
                                ? Object.keys(datosExtraidos[0])
                                : [],
                    datos: datosExtraidos
                }
            ]);
        } catch (error) {
            console.error(error);

            setMensajes(prev => [
                ...prev,
                {
                    tipo: 'ia',
                    explicacion:
                        error.message ||
                        'No fue posible procesar la consulta.',
                    error: true
                }
            ]);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        finChatRef.current?.scrollIntoView({
            behavior: 'smooth'
        });
    }, [mensajes]);

    return (
        <Modal
            show={mostrar}
            onHide={onCerrar}
            size="xl"
            centered
            backdrop="static"
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Consultas Inteligentes IA
                </Modal.Title>
            </Modal.Header>

            <Modal.Body
                style={{
                    height: '68vh',
                    overflowY: 'auto'
                }}
            >
                <div className="d-flex flex-column h-100">
                    <div className="flex-grow-1 overflow-auto pe-2">
                        {mensajes.length === 0 && (
                            <div className="text-center text-muted mt-5">
                                <h5>¿Qué deseas consultar?</h5>

                                <ul className="text-start mt-3">
                                    <li>Empleados con más horas trabajadas</li>
                                    <li>Asistencias de hoy</li>
                                    <li>Horas extras por empleado</li>
                                    <li>Incidencias del mes</li>
                                    <li>Empleados que siguen trabajando</li>
                                    <li>Jornadas cerradas esta semana</li>
                                </ul>
                            </div>
                        )}

                        {mensajes.map((msg, index) => (
                            <div
                                key={index}
                                className={`mb-4 ${msg.tipo === 'usuario'
                                        ? 'text-end'
                                        : ''
                                    }`}
                            >
                                <div
                                    className={`d-inline-block p-3 rounded-3 ${msg.tipo === 'usuario'
                                            ? 'bg-primary text-white'
                                            : 'bg-light border'
                                        }`}
                                    style={{ maxWidth: '95%' }}
                                >
                                    <strong>
                                        {msg.tipo === 'usuario'
                                            ? 'Tú'
                                            : 'Asistente IA'}
                                    </strong>

                                    <div className="mt-2">
                                        {msg.tipo === 'usuario'
                                            ? msg.contenido
                                            : msg.explicacion}
                                    </div>

                                    {msg.datos?.length > 0 && (
                                        <Table
                                            striped
                                            bordered
                                            hover
                                            responsive
                                            size="sm"
                                            className="mt-3"
                                        >
                                            <thead>
                                                <tr>
                                                    {msg.columnas.map(col => (
                                                        <th key={col}>
                                                            {col.replaceAll('_', ' ')}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {msg.datos.map((fila, i) => (
                                                    <tr key={i}>
                                                        {msg.columnas.map(col => (
                                                            <td key={col}>
                                                                {fila[col] ?? ''}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    )}
                                </div>
                            </div>
                        ))}

                        {cargando && (
                            <div className="text-center py-3">
                                <Spinner
                                    animation="border"
                                    size="sm"
                                />{' '}
                                Procesando consulta...
                            </div>
                        )}

                        <div ref={finChatRef} />
                    </div>

                    <Form
                        onSubmit={e => {
                            e.preventDefault();
                            enviarConsulta();
                        }}
                    >
                        <div className="d-flex gap-2 mt-2">
                            <Form.Control
                                value={entrada}
                                disabled={cargando}
                                placeholder="Ej: empleados con más horas extras"
                                onChange={e =>
                                    setEntrada(e.target.value)
                                }
                            />

                            <Button
                                type="submit"
                                disabled={
                                    cargando || !entrada.trim()
                                }
                            >
                                Enviar
                            </Button>
                        </div>
                    </Form>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ChatIA;

