import React from 'react'

export const ConfirmDelete = ({ onDelete, onCancel }) => {
    return (
        <div className="flex flex-col items-center py-6 space-y-4">
            <div className="text-center">
                <h2 className="text-klintoRed text-2xl font-semibold">Estás a punto de borrar este registro</h2>
                <p className="text-gray-700">¿Seguro que quieres hacerlo?</p>
            </div>

            <div className="flex items-center justify-center space-x-2">
                <button type="button" className="bg-klintoRed rounded-lg px-6 py-2 border shadow-md text-white" onClick={onDelete}>
                    Si, borrar
                </button>
                <button type="button" className="bg-gray-100 rounded-lg px-6 py-2 border shadow-md" onClick={onCancel}>
                    Cancelar
                </button>
            </div>
        </div>
    )
}