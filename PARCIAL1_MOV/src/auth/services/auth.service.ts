import { AuthResponse, LoginCredentials } from "../models/auth.model";
import { MOCK_TRAINER } from "../../pokedex/services/trainer.service";

const MOCK_AUTH_RESPONSE: AuthResponse = {
    token: "pokedex-token-12345",
    trainer: MOCK_TRAINER
};

export const authService = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        await new Promise((resolve) => setTimeout(resolve, 800));

        if (credentials.trainerId === "ASH-151" && credentials.secretCode === "pikachu") {
            return MOCK_AUTH_RESPONSE;
        }

        throw new Error("Invalid Trainer ID or Secret Code.");
    }
};