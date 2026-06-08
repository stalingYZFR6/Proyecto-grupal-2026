import React, { useState, useEffect } from "react";
import { Image, Spinner } from "react-bootstrap";
import { supabase } from "../../database/supabaseconfig";

const ImagenEmpleado = ({ src, className, style, width, height, roundedCircle }) => {
    const [imgSrc, setImgSrc] = useState("https://cdn-icons-png.flaticon.com/512/149/149071.png");
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        if (!src) {
            setImgSrc("https://cdn-icons-png.flaticon.com/512/149/149071.png");
            return;
        }

        // Si ya es un blob local (preview) o una URL externa común, la usamos directamente
        if (src.startsWith("blob:") || src.startsWith("data:") || !src.includes("supabase.co")) {
            setImgSrc(src);
            return;
        }

        // Si es una URL de Supabase Storage, la descargamos de forma segura
        const cargarImagenSegura = async () => {
            try {
                setCargando(true);
                // Extraer el nombre del archivo de la URL
                const partes = src.split("/");
                const nombreArchivo = partes[partes.length - 1];

                const { data, error } = await supabase.storage
                    .from("imagenes_empleados")
                    .download(nombreArchivo);

                if (error) throw error;

                if (data) {
                    const urlLocal = URL.createObjectURL(data);
                    setImgSrc(urlLocal);
                }
            } catch (err) {
                console.error("Error al descargar imagen de Supabase:", err);
                // Fallback a la URL pública por si acaso el bucket sí fuera público
                setImgSrc(src);
            } finally {
                setCargando(false);
            }
        };

        cargarImagenSegura();

        // Limpieza del objeto URL local al desmontar
        return () => {
            if (imgSrc && imgSrc.startsWith("blob:")) {
                URL.revokeObjectURL(imgSrc);
            }
        };
    }, [src]);

    if (cargando) {
        return (
            <div 
                className="d-inline-flex align-items-center justify-content-center bg-light border rounded-circle"
                style={{ width: width || 50, height: height || 50, ...style }}
            >
                <Spinner animation="border" size="sm" variant="primary" />
            </div>
        );
    }

    return (
        <Image
            src={imgSrc}
            className={className}
            style={{ objectFit: "cover", ...style }}
            width={width}
            height={height}
            roundedCircle={roundedCircle}
        />
    );
};

export default ImagenEmpleado;