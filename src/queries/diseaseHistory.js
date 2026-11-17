import axios from "axios";

export const getDiseaseParameters = async () => {
    try {
        const response = await axios.get(`http://localhost:3000/parametros_historial_enfermedades`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el catálogo de enfermedades:', error.message);
    }
}

export const getDiseaseHistoryByPatientId = async ({ patient_id }) => {
    if(!patient_id) return [];
    try {
        const response = await axios.get(`http://localhost:3000/historial_enfermedades/${patient_id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el historial de enfermedades:', error.message);
        throw error;
    }
}

export const createDiseaseHistory = async ({ diseaseData }) => {
    if(!diseaseData) return;
    try {
        const response = await axios.post(`http://localhost:3000/historial_enfermedades`, diseaseData);
        return response.data;
    } catch (error) {
        console.error('No se pudo registrar la enfermedad:', error.message);
        throw error;
    }
}
