import axios from "axios";

export const getVaccinationSchemes = async () => {
    try {
        const response = await axios.get(`http://localhost:3000/esquemas_vacunacion`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener los esquemas de vacunación:', error.message);
        throw error;
    }
};

// Esquema completo del paciente con el estado de cada dosis
export const getPatientVaccines = async ({ patient_id, esquema }) => {
    if (!patient_id) return;
    try {
        const response = await axios.get(`http://localhost:3000/pacientes/${patient_id}/vacunas`, {
            params: { esquema: esquema || undefined },
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener las vacunas del paciente:', error.message);
        throw error;
    }
};

// applicationData: { id_paciente, id_dosis, fecha_aplicacion, lote, lugar, observacion }
export const createVaccineApplication = async ({ applicationData }) => {
    try {
        const response = await axios.post(`http://localhost:3000/vacunas_aplicadas`, applicationData);
        return response.data;
    } catch (error) {
        console.error('No se pudo registrar la vacuna:', error.message);
        throw error;
    }
};

export const deleteVaccineApplication = async ({ id_aplicacion }) => {
    try {
        await axios.delete(`http://localhost:3000/vacunas_aplicadas/${id_aplicacion}`);
    } catch (error) {
        console.error('No se pudo quitar la vacuna:', error.message);
        throw error;
    }
};
