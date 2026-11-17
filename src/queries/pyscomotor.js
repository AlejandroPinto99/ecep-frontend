import axios from "axios";

export const createPsychomotorHistory = async ({ psychomotorData }) => {
    if(!psychomotorData) return;
    try {
        const response = await axios.post(`http://localhost:3000/antecedentes_psicomotores`, psychomotorData);
        return response.data;
    } catch (error) {
        console.error('No se pudo crear el historial psicomotor:', error.message);
        throw error;
    }
}

export const updatePsychomotorHistory = async ({ patient_id, psychomotorData }) => {
    try {
        const response = await axios.put(`http://localhost:3000/antecedentes_psicomotores/${patient_id}`, {
            data: {
                patient_id: patient_id,
                psychomotorData: psychomotorData
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al intentar actualizar el historial psicomotor:', error.message);
        throw error;
    }
};

export const getPsychomotorByPatientId = async ({ patient_id }) => {
    if(!patient_id) return null;
    try {
        const response = await axios.get(`http://localhost:3000/antecedentes_psicomotores/${patient_id}`);
        return response.data;
    } catch (error) {
        // Aún no existe historial psicomotor para este paciente: no es un error real
        if (error.response?.status === 404) return null;
        console.error('Error al intentar obtener el historial psicomotor:', error.message);
        throw error;
    }
};
