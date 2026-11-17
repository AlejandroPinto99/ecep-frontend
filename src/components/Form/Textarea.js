import React from 'react'

// Mismo estilo que Input, pero multilínea. `rows` controla la altura inicial.
export const Textarea = ({ name, methods, placeholder, className = "", label = "", required, rows = 4, rules }) => {
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
            <div className="flex border border-gray-400 rounded-lg p-2 w-full">
                <textarea
                    name={name}
                    {...methods.register(`${name}`, rules)}
                    className={`focus:outline-none focus:ring-0 w-full resize-y ${className}`}
                    placeholder={placeholder}
                    rows={rows}
                    required={required}
                />
            </div>
        </div>
    )
}
