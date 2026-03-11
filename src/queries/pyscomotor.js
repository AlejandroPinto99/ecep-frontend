import axios from "axios";

export const getPsychomotorParameters = async () => {
    try {
        const response = await axios.get(`http://localhost:3000/antecedentes_psicomotores/parametros`);
        return response.data;
    } catch (error) {
        // Manejar errores en la solicitud
        console.error('Error al obtener datos de la API:', error);
    }
}