import axios from "axios";

export const getDistricts = async (id_municipio) => {
    try {
        const response = await axios.get(`http://localhost:3000/distritos`, {
            params: id_municipio ? { id_municipio } : {},
        });
        return response.data;
    } catch (error) {
        // Manejar errores en la solicitud
        console.error('Error al obtener datos de la API:', error);
    }
}