import { UserIcon, TableCellsIcon } from '@heroicons/react/24/solid'
import {
    Link
} from "react-router-dom";
export const Sidebar = () => {
    return (
        <nav className=" bg-black min-h-screen p-4 sticky top-0">
            <div  className="h-[0.5px] bg-white w-full my-8"/>
            <div className="text-white space-y-8">
                <Link to="/pacientes">
                    <div className="flex items-center space-x-2 text-2xl hover:bg-gray-900 rounded-lg px-2 py-2 cursor-pointer">
                        <UserIcon className="h-6 w-6"/>
                        <p>Pacientes</p>
                    </div>
                </Link>
                <Link to="/citas">
                    <div className="flex items-center space-x-2 text-2xl hover:bg-gray-900 rounded-lg px-2 py-2 cursor-pointer">
                        <TableCellsIcon className="h-6 w-6"/>
                        <p>Citas</p>
                    </div>
                </Link>
            </div>
        </nav>
    );
}