import axios from "axios";

const createParamsString = (page, search) => {
    let params = '?';
    if(search) {
        params += `search=${search}`
    }

    if(page) { 
        params += params === '?' ? `page=${page}` : `&page=${page}`
    }

    return params;
}

export const getPatients = async ({ page, search }) => {
    try {
        const params = createParamsString(page, search);
        const response = await axios.get(`http://localhost:3000/patients${params}`);
        return response.data;
    } catch (error) {
        // Manejar errores en la solicitud
        console.error('Error al obtener datos de la API:', error);
    }
}

export const createPatient = async ({ patientData }) => {
    if(!patientData) return;
    try {
        const response = await axios.post(`http://localhost:3000/patients`, {
            primer_nombre: patientData.primer_nombre,
            segundo_nombre: patientData.segundo_nombre,
            tercer_nombre: patientData.tercer_nombre,
            primer_apellido: patientData.primer_apellido,
            segundo_apellido: patientData.segundo_apellido,
            tercer_apellido: patientData.tercer_apellido,
            fecha_nacimiento: patientData.fecha_nacimiento,
            sexo: patientData.sexo,
            numero_contacto: patientData.numero_contacto,
            departamento: patientData.departamento,
            municipio: patientData.municipio,
            distrito: patientData.distrito,
            direccion: patientData.direccion,
            hospital_nacimiento: patientData.hospital_nacimiento,
            nombres_padre: patientData.nombres_padre,
            nombres_madre: patientData.nombres_madre
        })
        return response.data.data;
    } catch(error) {
        console.error('No se pudo crear el paciente:', error.message);
        throw error;  // Opcionalmente puedes volver a lanzar el error para manejarlo en otro lugar
    }
    
}

export const getPatientById = async ({ patient_id }) => {
    if(!patient_id) return;
    try {
        const response = await axios.get(`http://localhost:3000/patients/${patient_id}`);
        return response.data;
    } catch (error) {
        // Manejar errores en la solicitud
        console.error('Error al intentar borrar el paciente:', error.message);
        throw error;  // Opcionalmente puedes volver a lanzar el error para manejarlo en otro lugar
    }
};

export const updatePatient = async ({ patient_id, patientData }) => {
    try {
        const response = await axios.put(`http://localhost:3000/patients/${patient_id}`, {
            data: {
                patient_id: patient_id,
                patientData: patientData
            }
        });
        return response.data;
    } catch (error) {
        // Manejar errores en la solicitud
        console.error('Error al intentar actualizar el paciente:', error.message);
        throw error;  // Opcionalmente puedes volver a lanzar el error para manejarlo en otro lugar
    }
};