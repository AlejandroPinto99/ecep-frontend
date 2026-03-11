import React from 'react'


export const Input = ({ name, methods, placeholder, className, label = "", errorMessage, required, type, icon }) => {
    return ( 
        <div>
            {
                label !== "" && (
                    <label className="text-sm font-semibold flex space-x-2">
                        <span>{label}</span>
                        {required && <span className="text-red-600">*</span> }
                    </label>
                )
            }
            <div className="flex items-center border border-gray-400 rounded-lg p-2 w-full">
                {icon } {/* Icono al inicio */}
                <input
                    name={name}
                    {...methods.register(`${name}`)}
                    className={`focus:outline-none focus:ring-0 w-full ${className}`}
                    placeholder={placeholder}
                    type={type}
                    required={required}
                />
            </div>
        </div>
    )
}