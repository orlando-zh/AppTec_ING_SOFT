import { useRegister } from "@/app/src/auth/viewmodels/use-register";
import { CustomInput } from "@/components/CustomInput"; // Asegúrate de que la ruta sea correcta
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
    View
} from "react-native";

export default function RegisterScreen() {
    const router = useRouter();
    const {
        email,
        lastName,
        fullName,
        password,
        confirmPassword,
        phone,
        setEmail,
        setLastName,
        setFullName,
        setPassword,
        setConfirmPassword,
        setPhone,
        handleRegister,
        errorMessage,
        isLoading
    } = useRegister();

    // Estado para manejar errores por cada campo individualmente
    const [errors, setErrors] = useState({
        fullName: "",
        lastName: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    // Expresiones regulares
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/; // Solo permite letras y espacios
    const phoneRegex = /^[0-9]*$/; // Solo permite números
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Validación estándar de email

    // Función de validación en tiempo real (handleChange)
    const handleChange = (field: string, value: string) => {
        let newErrors = { ...errors };

        switch (field) {
            case "fullName":
                // Bloquea números en el nombre
                if (!nameRegex.test(value)) {
                    newErrors.fullName = "El nombre no debe contener números ni caracteres especiales.";
                } else {
                    newErrors.fullName = "";
                    setFullName(value);
                }
                break;

            case "lastName":
                // Bloquea números en el apellido
                if (!nameRegex.test(value)) {
                    newErrors.lastName = "El apellido no debe contener números ni caracteres especiales.";
                } else {
                    newErrors.lastName = "";
                    setLastName(value);
                }
                break;

            case "phone":
                // Bloquea letras en el teléfono
                if (!phoneRegex.test(value)) {
                    newErrors.phone = "El teléfono solo debe contener números.";
                } else {
                    newErrors.phone = "";
                    setPhone(value);
                }
                break;

            case "email":
                const sanitizedEmail = value.replace(/\s/g, "");
                setEmail(sanitizedEmail);
                if (!sanitizedEmail) {
                    newErrors.email = "El correo es obligatorio.";
                } else if (!emailRegex.test(sanitizedEmail)) {
                    newErrors.email = "Formato de correo inválido.";
                } else {
                    newErrors.email = "";
                }
                break;

            case "password":
                setPassword(value);
                if (value.length < 6) {
                    newErrors.password = "Mínimo 6 caracteres.";
                } else {
                    newErrors.password = "";
                }
                // Validar coincidencia si confirmPassword ya tiene algo escrito
                if (confirmPassword && value !== confirmPassword) {
                    newErrors.confirmPassword = "Las contraseñas no coinciden.";
                } else {
                    newErrors.confirmPassword = "";
                }
                break;

            case "confirmPassword":
                setConfirmPassword(value);
                if (value !== password) {
                    newErrors.confirmPassword = "Las contraseñas no coinciden.";
                } else {
                    newErrors.confirmPassword = "";
                }
                break;
        }

        setErrors(newErrors);
    };

    // Validación de barrera antes de enviar
    const onSubmitRegister = async () => {
        // campos vacíos
        const isEmpty = !fullName || !lastName || !phone || !email || !password || !confirmPassword;
        const hasErrors = Object.values(errors).some((errorMsg) => errorMsg !== "");

        if (isEmpty || hasErrors) {
            Alert.alert(
                "Formulario inválido",
                "Completa todos los campos correctamente y revisa las advertencias en rojo antes de continuar."
            );
            return;
        }

        await handleRegister();
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
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Create Account</Text>

                    {/* Manejo de errores globales desde el backend */}
                    {errorMessage && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{errorMessage}</Text>
                        </View>
                    )}

                    <CustomInput
                        label="Full name"
                        placeholder="John"
                        value={fullName}
                        onChangeText={(text) => handleChange("fullName", text)}
                        errorMessage={errors.fullName}
                    />

                    <CustomInput
                        label="Last name"
                        placeholder="Doe"
                        value={lastName}
                        onChangeText={(text) => handleChange("lastName", text)}
                        errorMessage={errors.lastName}
                    />

                    <CustomInput
                        label="Phone"
                        placeholder="2121-2828"
                        keyboardType="numeric"
                        value={phone}
                        onChangeText={(text) => handleChange("phone", text)}
                        errorMessage={errors.phone}
                    />

                    <CustomInput
                        label="Email Address"
                        placeholder="name@user.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={(text) => handleChange("email", text)}
                        errorMessage={errors.email}
                    />

                    <CustomInput
                        label="Password"
                        placeholder="*************"
                        autoCapitalize="none"
                        value={password}
                        onChangeText={(text) => handleChange("password", text)}
                        errorMessage={errors.password}
                        isPassword={true}
                    />

                    <CustomInput
                        label="Confirm Password"
                        placeholder="*************"
                        autoCapitalize="none"
                        value={confirmPassword}
                        onChangeText={(text) => handleChange("confirmPassword", text)}
                        errorMessage={errors.confirmPassword}
                        isPassword={true}
                    />

                    {isLoading ? (
                        <ActivityIndicator size="large" color="#006C47" />
                    ) : (
                        <TouchableOpacity
                            style={styles.buttonRegister}
                            onPress={onSubmitRegister}
                        >
                            <Text style={styles.buttonRegisterText}>Register</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.singRow}>
                    <Text style={styles.singInText}>Already have an account?</Text>
                    <TouchableOpacity
                        onPress={() => router.push("/(public)")}
                    >
                        <Text style={styles.singTextLink}> Log in here</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 24,
        justifyContent: "center",
        paddingTop: 40
    },
    card: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#F3F4F6",
        padding: 24,
        borderRadius: 14,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1F2937",
        textAlign: "center",
        marginBottom: 20
    },
    buttonRegister: {
        backgroundColor: "#006C47",
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        borderRadius: 8,
        marginTop: 10,
    },
    buttonRegisterText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold"
    },
    singRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    singInText: {
        fontSize: 14,
        color: "#6B7280",
    },
    singTextLink: {
        fontSize: 14,
        color: "#006C47",
        fontWeight: "bold",
        marginLeft: 5
    },
    errorContainer: {
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: "#FEE2E2",
        borderColor: "#FCA5A5",
        marginBottom: 20,
        padding: 12
    },
    errorText: {
        fontSize: 15,
        textAlign: "center",
        color: "#DC2626",
        fontWeight: "500",
    }
});