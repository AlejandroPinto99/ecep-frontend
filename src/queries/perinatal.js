import axios from "axios";

export const createPerinatalHistory = async ({ perinatalData }) => {
    if(!perinatalData) return;
    try {
        const response = await axios.post(`http://localhost:3000/antecedentes_perinatales`, perinatalData);
        return response.data;
    } catch (error) {
        console.error('No se pudo crear el historial perinatal:', error.message);
        throw error;
    }
}

export const updatePerinatalHistory = async ({ patient_id, perinatalData }) => {
    try {
        const response = await axios.put(`http://localhost:3000/antecedentes_perinatales/${patient_id}`, {
            data: {
                patient_id: patient_id,
                perinatalData: perinatalData
            }
        });
        return response.data;
    } catch (error) {
        // Manejar errores en la solicitud
        console.error('Error al intentar actualizar el historial perinatal:', error.message);
        throw error;  // Opcionalmente puedes volver a lanzar el error para manejarlo en otro lugar
    }
};

export const getPerinatalHistoryByPatientId = async ({ patient_id }) => {
    if(!patient_id) return null;
    try {
        const response = await axios.get(`http://localhost:3000/antecedentes_perinatales/${patient_id}`);
        return response.data;
    } catch (error) {
        // Aún no existe historial perinatal para este paciente: no es un error real
        if (error.response?.status === 404) return null;
        console.error('Error al intentar obtener el historial perinatal:', error.message);
        throw error;
    }
};
