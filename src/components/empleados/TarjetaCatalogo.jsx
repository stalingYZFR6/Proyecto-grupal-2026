import React, { useEffect, useState } from "react";
import { Card, Image, Badge, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../database/supabaseconfig";

const TarjetaCatalogo = ({ empleado }) => {
    const navigate = useNavigate();
    const [esAdmin, setEsAdmin] = useState(false);

    useEffect(() => {
        const verificarRol = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: perfil } = await supabase
                    .from("usuarios")
                    .select("rol")
                    .eq("id_auth", user.id)
                    .maybeSingle();
                if (perfil && perfil.rol === "Admin") {
                    setEsAdmin(true);
                }
            }
        };
        verificarRol();
    }, []);

    return (
        <Card className="premium-card h-100 overflow-hidden border-0 shadow-sm d-flex flex-column">
            {/* Imagen Superior */}
            <div className="position-relative" style={{ height: "220px", overflow: "hidden" }}>
                <Image
                    src={empleado.url_imagen || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    className="w-100 h-100 object-fit-cover transition-all hover-zoom"
                    alt={`${empleado.nombre} ${empleado.apellido}`}
                />
                <div className="position-absolute bottom-0 start-0 w-100 p-3 bg-gradient-dark text-white">
                    <Badge bg="primary" className="rounded-pill px-3 py-1 shadow-sm">
                        ID: #{empleado.id_empleado}
                    </Badge>
                </div>
            </div>

            <Card.Body className="p-4 flex-grow-1">
                <h5 className="fw-bold mb-1 text-premium-main">
                    {empleado.nombre} {empleado.apellido}
                </h5>
                <p className="text-muted small mb-3">
                    <i className="bi bi-card-text me-2"></i>
                    {empleado.cedula}
                </p>

                <hr className="my-3 opacity-10" />

                <div className="space-y-2">
                    <div className="d-flex align-items-center gap-2 text-premium-muted small mb-2">
                        <i className="bi bi-envelope text-primary"></i>
                        <span className="text-truncate">{empleado.correo || "Sin correo"}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 text-premium-muted small">
                        <i className="bi bi-telephone text-primary"></i>
                        <span>{empleado.telefono || "Sin teléfono"}</span>
                    </div>
                </div>
            </Card.Body>

            {esAdmin && (
                <Card.Footer className="bg-transparent border-0 p-4 pt-0">
                    <Button 
                        variant="outline-primary" 
                        className="w-100 rounded-3 py-2 small fw-bold border-2"
                        onClick={() => navigate(`/perfil/${empleado.id_empleado}`)}
                    >
                        📁 Ver expediente completo
                    </Button>
                </Card.Footer>
            )}
        </Card>
    );
};

export default TarjetaCatalogo;