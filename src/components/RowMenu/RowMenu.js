import React, { useEffect, useRef } from "react";

import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";

// Menú de acciones por fila. El estado abierto/cerrado lo maneja el padre:
// - onSelect: alterna el menú (clic en el botón de los tres puntos)
// - onClose:  lo cierra (clic fuera del menú, tecla Escape o al elegir una opción)
export const RowMenu = ({ options, isOpen, onSelect, onClose }) => {
    const ref = useRef(null);

    useEffect(() => {
        if (!isOpen || !onClose) return;

        // mousedown/touchstart (y no click) para cerrar antes de que otro botón
        // reciba el clic: así abrir el menú de otra fila funciona con un solo clic.
        const handlePointer = (event) => {
            if (ref.current && !ref.current.contains(event.target)) onClose();
        };
        const handleKey = (event) => {
            if (event.key === "Escape") onClose();
        };

        document.addEventListener("mousedown", handlePointer);
        document.addEventListener("touchstart", handlePointer);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handlePointer);
            document.removeEventListener("touchstart", handlePointer);
            document.removeEventListener("keydown", handleKey);
        };
    }, [isOpen, onClose]);

    return (
        <div className="relative" ref={ref}>
            <button type="button" onClick={onSelect} aria-haspopup="menu" aria-expanded={!!isOpen}>
                <EllipsisVerticalIcon className={`w-4 h-4 ${isOpen ? 'text-red-400' : 'text-black'}`} />
            </button>
            {
                isOpen && (
                    <div role="menu" className="absolute shadow-lg bg-white flex flex-col items-start text-xs rounded-lg -translate-y-4 -translate-x-16 z-20">
                        {
                            options.map((option, index) => {
                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        role="menuitem"
                                        onClick={() => {
                                            onClose?.();
                                            option.action();
                                        }}
                                        className="px-4 py-2 "
                                    >
                                        {option.name}
                                    </button>
                                )
                            })
                        }
                    </div>
                )
            }
        </div>
    )
}
