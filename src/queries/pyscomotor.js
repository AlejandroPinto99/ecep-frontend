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

export const createPsychomotorHistory = async ({ psychomotorData }) => {
    if(!psychomotorData) return;
    try {
        const response = await axios.post(`http://localhost:3000/antecedentes_psicomotores`, {
            psychomotor_parameter: psychomotorData.psychomotor_parameter,
            patient_id: psychomotorData.patient_id,
            general_observations: psychomotorData.general_observations
        });
        return response.data;
    } catch (error) {
        console.error('No se pudo crear el historial psicomotor:', error.message);
        throw error;
    }
}

export const getPsychomotorByPatientId = async ({ patient_id }) => {
    if(!patient_id) return;
    try {
        const response = await axios.get(`http://localhost:3000/antecedentes_psicomotores/${patient_id}`);
        return response.data;
    } catch (error) {
        // Manejar errores en la solicitud
        console.error('Error al intentar obtener el historial psicomotor:', error.message);
        throw error;  // Opcionalmente puedes volver a lanzar el error para manejarlo en otro lugar
    }
};

export const getPsychomotorHistoryParameters = async ({ evaluacion_id }) => {
    if(!evaluacion_id) return;
    try {
        const response = await axios.get(`http://localhost:3000/antecedentes_psicomotores/${evaluacion_id}/parametros`);
        return response.data;
    } catch (error) {
        // Manejar errores en la solicitud
        console.error('Error al intentar obtener el historial psicomotor:', error.message);
        throw error;  // Opcionalmente puedes volver a lanzar el error para manejarlo en otro lugar
    }
};

export const updatePsychomotorParameters = async ({ evaluation_id, psychomotorData }) => {
    try {
        const response = await axios.put(`http://localhost:3000/antecedentes_psicomotores/${evaluation_id}/parametros`, {
            data: {
                evaluation_id: evaluation_id,
                psychomotorData: psychomotorData
            }
        });
        return response.data;
    } catch (error) {
        // Manejar errores en la solicitud
        console.error('Error al intentar actualizar el historial psicomotor:', error.message);
        throw error;  // Opcionalmente puedes volver a lanzar el error para manejarlo en otro lugar
    }
};