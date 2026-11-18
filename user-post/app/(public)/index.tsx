import { CustomInput } from "@/components/CustomInput";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useLogin } from "../src/auth/viewmodels/use-login";

export default function LoginScreen() {
    const router = useRouter();
    const {
        email,
        password,
        setEmail,
        setPassword,
        isLoading,
        errorMessage,
        handleLogin,
    } = useLogin();

    // Estado para gestionar los mensajes de error de cada campo
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({
        email: "",
        password: "",
    });

    // Expresión regular estándar para validar correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validación en tiempo real
    const handleChange = (field: "email" | "password", value: string) => {
        if (field === "email") {
            // quitar espacios en blanco en el correo
            const sanitizedEmail = value.replace(/\s/g, "");
            setEmail(sanitizedEmail);

            if (!sanitizedEmail) {
                setErrors((prev) => ({
                    ...prev,
                    email: "El correo electrónico es obligatorio.",
                }));
            } else if (!emailRegex.test(sanitizedEmail)) {
                setErrors((prev) => ({
                    ...prev,
                    email: "Ingresa un formato de correo válido (ej. usuario@dominio.com).",
                }));
            } else {
                setErrors((prev) => ({ ...prev, email: "" }));
            }
        }

        if (field === "password") {
            setPassword(value);

            if (!value) {
                setErrors((prev) => ({
                    ...prev,
                    password: "La contraseña es obligatoria.",
                }));
            } else if (value.length < 6) {
                setErrors((prev) => ({
                    ...prev,
                    password: "La contraseña debe tener al menos 6 caracteres.",
                }));
            } else {
                setErrors((prev) => ({ ...prev, password: "" }));
            }
        }
    };

    // Validación de barrera antes de enviar la petición al backend
    const onSubmitLogin = async () => {
        const isEmailEmpty = !email.trim();
        const isPasswordEmpty = !password.trim();
        const hasActiveErrors = Boolean(errors.email || errors.password);

        if (isEmailEmpty || isPasswordEmpty || hasActiveErrors) {
            setErrors({
                email: isEmailEmpty
                    ? "El correo electrónico es obligatorio."
                    : errors.email,
                password: isPasswordEmpty
                    ? "La contraseña es obligatoria."
                    : errors.password,
            });

            Alert.alert(
                "Formulario inválido",
                "Por favor, completa todos los campos correctamente y corrige los errores antes de continuar."
            );
            return;
        }

        await handleLogin();
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "android" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Feather name="shopping-bag" size={25} color="#fff" />
                    </View>
                    <Text style={styles.appNameLabel}>ShopEase</Text>
                    <Text style={styles.welcomeLabel}>
                        Welcome back! Please enter your details
                    </Text>
                </View>

                {/* CARD */}
                <View style={styles.card}>
                    {errorMessage && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{errorMessage}</Text>
                        </View>
                    )}

                    <CustomInput
                        label="Email Address"
                        placeholder="name@gmail.com"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={(text) => handleChange("email", text)}
                        errorMessage={errors.email}
                    />

                    <View style={styles.passwordHeaderRow}>
                        <TouchableOpacity>
                            <Text style={styles.forgotPasswordLabel}>
                                Forgot Password
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <CustomInput
                        label="Password"
                        placeholder="*************"
                        autoCapitalize="none"
                        value={password}
                        onChangeText={(text) => handleChange("password", text)}
                        errorMessage={errors.password}
                        isPassword={true}
                    />

                    {isLoading ? (
                        <ActivityIndicator size="large" color="#006C47" />
                    ) : (
                        <TouchableOpacity
                            style={styles.buttonLogin}
                            onPress={onSubmitLogin}
                        >
                            <Text style={styles.buttonLoginText}>Log in</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.signUpRow}>
                    <Text style={styles.singUpText}>Does not have account?</Text>
                    <TouchableOpacity
                        onPress={() => router.push("/(public)/register")}
                    >
                        <Text style={styles.singUpTextLink}> Sing up for free</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 24,
    },
    header: {
        alignItems: "center",
    },
    logoContainer: {
        width: 60,
        height: 60,
        backgroundColor: "#00B074",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 16,
    },
    appNameLabel: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#006C47",
    },
    welcomeLabel: {
        fontSize: 15,
        color: "#6B7280",
        marginBottom: 25,
    },
    card: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#F3F4F6",
        borderRadius: 14,
        shadowColor: "#fff",
        textShadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        padding: 24,
        elevation: 2,
    },
    passwordHeaderRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginBottom: -18,
        zIndex: 1,
    },
    forgotPasswordLabel: {
        color: "#006C47",
        fontWeight: "600",
    },
    buttonLogin: {
        backgroundColor: "#006C47",
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        borderRadius: 8,
        marginTop: 5,
    },
    buttonLoginText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    signUpRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 35,
    },
    singUpText: {
        fontSize: 14,
        color: "#6B7280",
    },
    singUpTextLink: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#006C47",
    },
    errorContainer: {
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: "#FEE2E2",
        borderColor: "#FCA5A5",
        marginBottom: 20,
        padding: 12,
    },
    errorText: {
        fontSize: 15,
        textAlign: "center",
        color: "#DC2626",
        fontWeight: "500",
    },
});