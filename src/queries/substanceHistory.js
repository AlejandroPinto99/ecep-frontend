import axios from "axios";

export const getSubstanceParameters = async () => {
    try {
        const response = await axios.get(`http://localhost:3000/sustancias`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el catálogo de sustancias:', error.message);
    }
}

export const getSubstanceHistoryByPatientId = async ({ patient_id }) => {
    if(!patient_id) return [];
    try {
        const response = await axios.get(`http://localhost:3000/sustancias_ingeridas_madre/${patient_id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener las sustancias ingeridas por la madre:', error.message);
        throw error;
    }
}

export const createSubstanceHistory = async ({ substanceData }) => {
    if(!substanceData) return;
    try {
        const response = await axios.post(`http://localhost:3000/sustancias_ingeridas_madre`, substanceData);
        return response.data;
    } catch (error) {
        console.error('No se pudo registrar la sustancia:', error.message);
        throw error;
    }
}
