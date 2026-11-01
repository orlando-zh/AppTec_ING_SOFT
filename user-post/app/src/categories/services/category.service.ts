import { apiClient } from "@/api/ApiClient";
import axios from "axios";

export interface CategoryResponse {
    id: number;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export const CategoryService = {
    createCategory: async (
        name: string,
        description: string,
        token: string
    ): Promise<CategoryResponse> => {
        try {
            const authTokenHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`

            // CAMBIO: Usamos apiClient y omitimos el API_URL
            const response = await apiClient.post(
                `/categories/create`,
                {
                    name,
                    description
                },
                {
                    headers: {
                        Authorization: authTokenHeader,
                        "Content-Type": "application/json"
                    }
                }
            )
            console.log("Respuesta del servidor (crear categoría):", response.data);

            return response.data
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.log("Error del servidor (crear categoría):", error.response.data);
                throw new Error(error.response.data?.message || "Error to save category")
            }
            throw new Error("Server error")
        }
    },

    getCategories: async (token: string): Promise<CategoryResponse[]> => {
        try {
            const authTokenHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

            // CAMBIO: Usamos apiClient y omitimos el API_URL
            const response = await apiClient.get<CategoryResponse[]>(
                `/categories`,
                {
                    headers: {
                        Authorization: authTokenHeader
                    }
                }
            );

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data?.message || "Error to get categories");
            }
            throw new Error("Server error");
        }
    }
}