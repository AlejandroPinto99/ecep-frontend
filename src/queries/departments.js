import axios from "axios";

export const getDepartments = async () => {
    try {
        const response = await axios.get(`http://localhost:3000/departamentos`);
        return response.data;
    } catch (error) {
        // Manejar errores en la solicitud
        console.error('Error al obtener datos de la API:', error);
    }
}