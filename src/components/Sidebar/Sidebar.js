import { useLayoutEffect, useRef, useState } from 'react'
import { UserIcon, TableCellsIcon } from '@heroicons/react/24/solid'
import {
    Link,
    useLocation
} from "react-router-dom";

const ITEMS = [
    { to: "/pacientes", label: "Pacientes", Icon: UserIcon },
    { to: "/consultas", label: "Consultas", Icon: TableCellsIcon },
];

// Un ítem está activo en su ruta y en todas las que cuelgan de ella
// (/pacientes/12, /consultas/5/editar, ...).
const estaActivo = (pathname, to) => pathname === to || pathname.startsWith(`${to}/`);

export const Sidebar = () => {
    const { pathname } = useLocation();
    const refs = useRef({});
    // Posición del contorno verde: se desliza hasta el ítem activo
    const [indicador, setIndicador] = useState(null);

    const activo = ITEMS.find((item) => estaActivo(pathname, item.to));

    useLayoutEffect(() => {
        const el = activo && refs.current[activo.to];
        setIndicador(el ? { top: el.offsetTop, height: el.offsetHeight } : null);
    }, [activo]);

    return (
        <nav className="bg-black min-h-screen p-4 pt-6 sticky top-0">
            <div className="relative text-white space-y-2">
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 border-2 border-klintoRed rounded-lg pointer-events-none transition-all duration-300 ease-in-out"
                    style={{
                        transform: `translateY(${indicador?.top ?? 0}px)`,
                        height: indicador?.height ?? 0,
                        opacity: indicador ? 1 : 0,
                    }}
                />
                {ITEMS.map(({ to, label, Icon }) => (
                    <Link
                        key={to}
                        to={to}
                        ref={(el) => (refs.current[to] = el)}
                        aria-current={activo?.to === to ? "page" : undefined}
                        className="block"
                    >
                        <div className="flex items-center space-x-2 text-2xl hover:bg-gray-900 rounded-lg px-3 py-2 cursor-pointer transition-colors duration-300">
                            <Icon className="h-6 w-6"/>
                            <p>{label}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </nav>
    );
}
