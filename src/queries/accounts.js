import axios from "axios";

export const getAccounts = async () => {
    try {
        const response = await axios.get(`http://localhost:3000/accounts`);
        return response.data;
    } catch (error) {
        // Manejar errores en la solicitud
        console.error('Error al obtener datos de la API:', error);
    }
}