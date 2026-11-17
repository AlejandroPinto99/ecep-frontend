import axios from "axios";

export const getConsultas = async ({ page, search }) => {
    try {
        const response = await axios.get(`http://localhost:3000/consultas`, {
            params: { page, search: search || undefined },
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener las consultas:', error.message);
        throw error;
    }
};

export const getConsultasByPatientId = async ({ patient_id, page, limit }) => {
    if (!patient_id) return;
    try {
        const response = await axios.get(`http://localhost:3000/consultas/paciente/${patient_id}`, {
            params: { page, limit },
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener las consultas del paciente:', error.message);
        throw error;
    }
};

export const getLabExamParameters = async () => {
    try {
        const response = await axios.get(`http://localhost:3000/parametros_examen_laboratorio`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener los tipos de examen de laboratorio:', error.message);
        throw error;
    }
};

export const getRevisionParameters =async () => {
    try {
        const response = await axios.get(`http://localhost:3000/parametros_revision_fisica`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener las revisiones del examen físico:', error.message);
        throw error;
    }
};

// consultaData: { id_paciente, datos_consulta, examen_fisico, examenes_laboratorio, resultados }
export const createConsulta = async ({ consultaData }) => {
    try {
        const response = await axios.post(`http://localhost:3000/consultas`, consultaData);
        return response.data;
    } catch (error) {
        console.error('No se pudo crear la consulta:', error.message);
        throw error;
    }
};

// Reemplaza la consulta completa (incluidas revisiones y exámenes de laboratorio).
// consultaData: { datos_consulta, examen_fisico, examenes_laboratorio, resultados }
export const updateConsulta = async ({ consulta_id, consultaData }) => {
    try {
        const response = await axios.put(`http://localhost:3000/consultas/${consulta_id}`, consultaData);
        return response.data;
    } catch (error) {
        console.error('No se pudo actualizar la consulta:', error.message);
        throw error;
    }
};

// Curvas de crecimiento OMS de una consulta, con el punto del paciente
export const getGrowthCurves = async ({ consulta_id }) => {
    if (!consulta_id) return;
    try {
        const response = await axios.get(`http://localhost:3000/consultas/${consulta_id}/curva_crecimiento`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener las curvas de crecimiento:', error.message);
        throw error;
    }
};

export const getConsultaById =async ({ consulta_id }) => {
    if (!consulta_id) return;
    try {
        const response = await axios.get(`http://localhost:3000/consultas/${consulta_id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener la consulta:', error.message);
        throw error;
    }
};
