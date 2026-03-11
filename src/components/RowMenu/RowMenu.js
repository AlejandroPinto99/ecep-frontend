import React from "react";

import { useState } from "react";

import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";

export const RowMenu = ({ options, isOpen, onSelect }) => {
    
    return (
        <div className="relative">
            <button type="button" onClick={onSelect}>
                <EllipsisVerticalIcon className={`w-4 h-4 ${isOpen ? 'text-red-400' : 'text-black'}`} />
            </button>
            {
                isOpen && (
                    <div className="absolute shadow-lg bg-white flex flex-col items-start text-xs rounded-lg -translate-y-4 -translate-x-16 z-20">
                        {
                            options.map((option, index) => {
                                return (
                                    <button 
                                        key={index}
                                        type="button"
                                        onClick={() => option.action()}
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