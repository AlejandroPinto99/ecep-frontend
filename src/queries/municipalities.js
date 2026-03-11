import axios from "axios";

export const getMunicipalities = async (departamento_id) => {
    try {
        const response = await axios.get(`http://localhost:3000/municipios?id_departamento=${departamento_id}`);
        return response.data;
    } catch (error) {
        // Manejar errores en la solicitud
        console.error('Error al obtener datos de la API:', error);
    }
}