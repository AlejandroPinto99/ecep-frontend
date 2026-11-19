import React from 'react';
import { createSolidTable, flexRender, getCoreRowModel } from '@tanstack/solid-table';


const BasicTable = ({ tableColumns, tableData }) => {
        const table = createSolidTable({
            columns: tableColumns,
            data: tableData,
            getCoreRowModel: getCoreRowModel(),
        });
    return (
        <table className="w-full">
        <thead >
            {table.getHeaderGroups()?.map(headerGroup => (
            <tr key={headerGroup.id}>
                {headerGroup.headers?.map(header => (
                <th key={header.id} className="px-4 py-2 text-left">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
                ))}
            </tr>
            ))}
        </thead>
        <tbody>
            {table.getRowModel().rows?.map(row => (
            <tr key={row.id} className={`${row.id % 2 ? 'bg-klintoRed bg-opacity-20' : 'bg-white'} `}>
                {row.getVisibleCells()?.map(cell => (
                <td key={cell.id} className="py-2" >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
                ))}
            </tr>
            ))}
        </tbody>
        </table>
    );
};

export default BasicTable;