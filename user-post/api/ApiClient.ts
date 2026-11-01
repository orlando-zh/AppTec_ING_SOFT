import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const API_URL = "https://api-ecommerce-5aby.onrender.com";

// 1. Crear la instancia global de axios
export const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});

// 2. Agregar el interceptor de RESPUESTA
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        // Validar si es 401 y excluir la ruta de login
        if (
            error.response?.status === 401 &&
            !error.config.url.includes('/auth/login')
        ) {
            console.log("Interceptor global detectó 401.");
            await AsyncStorage.multiRemove(["@auth_token", "@auth_user"]);
        }

        return Promise.reject(error);
    }
);