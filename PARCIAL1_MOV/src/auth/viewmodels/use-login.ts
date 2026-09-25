import { useState } from "react";
import { authService } from "../services/auth.service";
import { useRouter } from "expo-router";

export function useLogin() {
    const router = useRouter();

    // los nombres a los requerimientos de la Pokédex
    const [trainerId, setTrainerId] = useState("");
    const [secretCode, setSecretCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorsMessage] = useState<string | null>(null);
    const [isSecretCodeVisible, setIsSecretCodeVisible] = useState(false);

    const toggleSecretCodeVisibility = () => {
        setIsSecretCodeVisible((prev) => !prev);
    };

    const handleLogin = async () => {
        if (!trainerId || !secretCode) {
            setErrorsMessage("Please, complete all fields");
            return;
        }
        setErrorsMessage(null);
        setIsLoading(true);

        try {
            const data = await authService.login({ trainerId, secretCode });
            console.log("TOKEN", data.token);

            router.replace("/(protected)/grid");
        } catch (error: any) {
            setErrorsMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        trainerId,
        secretCode,
        setTrainerId,
        setSecretCode,
        isLoading,
        errorMessage,
        isSecretCodeVisible,
        toggleSecretCodeVisibility,
        handleLogin,
    };
}