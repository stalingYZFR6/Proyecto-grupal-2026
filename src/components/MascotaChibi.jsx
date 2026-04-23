import React, { useState } from "react";

const MascotaChibi = () => {
    const [activo, setActivo] = useState(false);

    const manejarClick = () => {
        setActivo(true);

        // quitar animación después de un tiempo
        setTimeout(() => setActivo(false), 600);
    };

    return (
        <div className="chibi-container">
            <img
                src="https://media.tenor.com/ayAkes0hk-0AAAAj/neco-arc.gif"
                alt="Neco Arc"
                className={`chibi ${activo ? "chibi-activo" : ""}`}
                onClick={manejarClick}
            />
        </div>
    );
};

export default MascotaChibi;