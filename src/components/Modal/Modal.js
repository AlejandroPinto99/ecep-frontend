import React, { useEffect, useState } from 'react';

const Modal = ({ isOpen, onClose, children, title = '' }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
        setIsVisible(true); // Monta el modal y muestra la animación de entrada
        } else {
        // Inicia la animación de salida y luego desmonta
        const timer = setTimeout(() => setIsVisible(false), 300);
        return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen && !isVisible) return null; // Evita el renderizado si el modal no está visible

    return (
        <div className={`fixed inset-0 flex items-center justify-center z-50`}>
        {/* Fondo oscurecido con animación de entrada */}
        <div
            className="fixed inset-0 bg-black opacity-50 transition-opacity duration-300"
            onClick={onClose}
        ></div>

        {/* Contenedor del Modal con animación de entrada */}
        <div className={`bg-white mb-4 p-6 rounded-lg shadow-lg z-10 max-w-[1200px] w-full mx-4 transform transition-all duration-300 ease-out scale-100 ${isOpen ? 'fade-in' : 'fade-out'}`}>
            <h3 className="text-klintoRed text-2xl text-center font-bold mb-4">
                {title}
            </h3>
            <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-3xl"
            >
            &times;
            </button>
            {children}
        </div>
        </div>
    );
};

export default Modal;
