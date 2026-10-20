import { CreateProductRequest, CreateProductResponse } from "../models/product.model";
import axios, {isAxiosError} from "axios";
import {API_URL} from "@/api/ApiClient";

export const ProductService = {
    createProduct: async (
        productRequest: CreateProductRequest,
        token: string
    ): Promise<CreateProductResponse> => {
        try {
            const authTokenHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

            const response = await axios.post<CreateProductResponse>(
                `${API_URL}/products/create`,
                productRequest,
                {
                    headers: {
                        Authorization: authTokenHeader,
                        "Content-Type": "application/json"
                    }
                }
            );

            return response.data;
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                throw new Error(error.response.data?.message || "Error al crear el producto");
            }
            throw new Error("Server error");
        }
    }
}