import { interceptorClearSession } from "@/app/src/context/AuthContext";
import axios from "axios";

export const API_URL = "https://api-ecommerce-5aby.onrender.com";

export const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});

apiClient.interceptors.response.use(
    (response) => {
        // Pasa directamente las respuestas exitosas del backend sin alterar
        return response;
    },
    async (error) => {
        // Maneja de forma legítima los errores 401 reales provenientes de la API
        if (
            error.response?.status === 401 &&
            !error.config?.url?.includes('/auth/login')
        ) {
            console.log("Interceptor global detectó 401 real. Ejecutando clearSession...");

            if (interceptorClearSession) {
                interceptorClearSession();
            }
        }

        return Promise.reject(error);
    }
);