import React from "react";
import { Table, Badge, Button, Image, Card } from "react-bootstrap";

const TablaUsuarios = ({ usuarios, abrirEditar, abrirEliminar }) => {
    
    const renderRol = (rol) => {
        const config = {
            administrador: { bg: 'danger', text: 'Administrador' },
            empleado: { bg: 'primary', text: 'Empleado' }
        };
        const item = config[rol] || config.empleado;
        return <Badge bg={item.bg} className="bg-opacity-10 text-capitalize px-3 py-2 rounded-pill" style={{ color: `var(--bs-${item.bg})` }}>{item.text}</Badge>;
    };

    const renderEstado = (activo) => (
        <Badge bg={activo ? 'success' : 'secondary'} className="bg-opacity-10 px-3 py-2 rounded-pill" style={{ color: activo ? '#198754' : '#6c757d' }}>
            {activo ? 'Activo' : 'Inactivo'}
        </Badge>
    );

    return (
        <>
            {/* Vista Desktop */}
            <div className="d-none d-md-block">
                <Table responsive hover className="align-middle mb-0">
                    <thead className="bg-light">
                        <tr>
                            <th className="border-0 rounded-start py-3 px-4">Usuario</th>
                            <th className="border-0 py-3">Rol</th>
                            <th className="border-0 py-3">Estado</th>
                            <th className="border-0 py-3">Creado</th>
                            <th className="border-0 rounded-end py-3 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((u) => (
                            <tr key={u.id_usuario}>
                                <td className="px-4">
                                    <div className="d-flex align-items-center gap-3">
                                        <Image 
                                            src={u.empleado?.url_imagen || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                                            roundedCircle 
                                            width={40} 
                                            height={40} 
                                            className="border shadow-sm object-fit-cover"
                                        />
                                        <div>
                                            <div className="fw-bold">{u.empleado?.nombre} {u.empleado?.apellido}</div>
                                            <div className="small text-muted">{u.empleado?.correo}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{renderRol(u.rol)}</td>
                                <td>{renderEstado(u.activo)}</td>
                                <td className="small text-muted">
                                    {new Date(u.created_at).toLocaleDateString()}
                                </td>
                                <td className="text-center">
                                    <div className="d-flex justify-content-center gap-2">
                                        <Button variant="light" size="sm" className="rounded-3 p-2" onClick={() => abrirEditar(u)}>
                                            <i className="bi bi-pencil text-warning"></i>
                                        </Button>
                                        <Button variant="light" size="sm" className="rounded-3 p-2" onClick={() => abrirEliminar(u)}>
                                            <i className="bi bi-trash text-danger"></i>
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Vista Móvil */}
            <div className="d-md-none">
                <div className="row g-3">
                    {usuarios.map((u) => (
                        <div key={u.id_usuario} className="col-12">
                            <Card className="premium-card border-0 shadow-sm">
                                <Card.Body className="p-3">
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <Image 
                                            src={u.empleado?.url_imagen || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                                            roundedCircle 
                                            width={50} 
                                            height={50} 
                                            className="border shadow-sm object-fit-cover"
                                        />
                                        <div className="flex-grow-1">
                                            <div className="fw-bold">{u.empleado?.nombre} {u.empleado?.apellido}</div>
                                            <div className="small text-muted">{u.empleado?.correo}</div>
                                        </div>
                                        <div className="d-flex flex-column gap-1">
                                            <Button variant="light" size="sm" className="rounded-3" onClick={() => abrirEditar(u)}>
                                                <i className="bi bi-pencil text-warning"></i>
                                            </Button>
                                            <Button variant="light" size="sm" className="rounded-3" onClick={() => abrirEliminar(u)}>
                                                <i className="bi bi-trash text-danger"></i>
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                                        {renderRol(u.rol)}
                                        {renderEstado(u.activo)}
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default TablaUsuarios;