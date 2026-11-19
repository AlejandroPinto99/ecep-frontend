import axios from "axios";

// fecha: YYYY-MM-DD en hora local del navegador (define cuál es "hoy" y "el mes actual")
export const getDashboardSummary = async ({ fecha }) => {
    try {
        const response = await axios.get(`http://localhost:3000/dashboard/resumen`, {
            params: { fecha },
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener el resumen del dashboard:', error.message);
        throw error;
    }
};
