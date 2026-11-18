import { AuthService } from "@/app/src/auth/services/auth.service";
import { useAuth } from "@/app/src/context/AuthContext";
import { CustomInput } from "@/components/CustomInput";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
    const router = useRouter();
    const { user, token, updateUserSession } = useAuth();

    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    // Estado centralizado para mensajes de error
    const [errors, setErrors] = useState({
        name: "",
        lastName: "",
        phone: "",
    });

    // Expresiones regulares para validación estricta
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/; // Solo letras y espacios
    const phoneRegex = /^[0-9]*$/; // Solo números

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setLastName(user.lastName || "");
            setPhone(user.phone || "");
        }
    }, [user]);

    // Validación en tiempo real y bloqueo inmediato
    const handleChange = (field: "name" | "lastName" | "phone", value: string) => {
        let newErrors = { ...errors };

        switch (field) {
            case "name":
                if (!nameRegex.test(value)) {
                    newErrors.name = "El nombre no debe contener números ni caracteres especiales.";
                } else {
                    newErrors.name = "";
                    setName(value);
                }
                break;

            case "lastName":
                if (!nameRegex.test(value)) {
                    newErrors.lastName = "El apellido no debe contener números ni caracteres especiales.";
                } else {
                    newErrors.lastName = "";
                    setLastName(value);
                }
                break;

            case "phone":
                if (!phoneRegex.test(value)) {
                    newErrors.phone = "El teléfono solo debe contener números.";
                } else {
                    newErrors.phone = "";
                    setPhone(value);
                }
                break;
        }

        setErrors(newErrors);
    };

    // Validación de barrera previa a la actualización
    const handleUpdateUser = async () => {
        const isNameEmpty = !name.trim();
        const isLastNameEmpty = !lastName.trim();
        const isPhoneEmpty = !phone.trim();
        const hasActiveErrors = Boolean(errors.name || errors.lastName || errors.phone);

        if (isNameEmpty || isLastNameEmpty || isPhoneEmpty || hasActiveErrors) {
            setErrors({
                name: isNameEmpty ? "El nombre es obligatorio." : errors.name,
                lastName: isLastNameEmpty ? "El apellido es obligatorio." : errors.lastName,
                phone: isPhoneEmpty ? "El teléfono es obligatorio." : errors.phone,
            });

            Alert.alert(
                "Formulario inválido",
                "Por favor llena todos los campos correctamente y corrige los errores antes de continuar."
            );
            return;
        }

        if (!user?.id || !token) {
            Alert.alert("Error de sesión", "No se encontró el usuario");
            return;
        }

        setIsUpdating(true);
        try {
            const updatedUser = await AuthService.updateUser(
                user.id,
                name,
                lastName,
                phone,
                token
            );
            await updateUserSession(updatedUser);
            Alert.alert(
                "Excelente",
                "Tu información ha sido actualizada con éxito en el servidor"
            );
        } catch (error: any) {
            console.log("Error al actualizar usuario:", error);
            Alert.alert("Error de registro", error.message || "No se pudo actualizar");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Drawer.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.replace("/(protected)/dashboard")}>
                    <Ionicons name="arrow-back-outline" size={26} />
                </TouchableOpacity>
                <Text style={styles.logoText}>ShopEase</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* TARJETA DE PERFIL */}
                <View style={styles.profileCard}>
                    <View style={styles.imageWrapper}>
                        <Image
                            source={{ uri: "https://i.pinimg.com/originals/89/19/cc/8919cc617f8055034f35ca883cd32b89.jpg" }}
                            style={styles.profileAvatar}
                        />
                        <TouchableOpacity style={styles.cameraBtn}>
                            <Ionicons name="camera" size={16} color={"#FFF"} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.profileName}>Orlando Bladimir Zuniga Hernandez</Text>
                    <Text style={styles.profileSubtitle}>Full Stack Developer</Text>

                    {/* TARJETAS DE PUNTOS Y ÓRDENES */}
                    <View style={styles.cardPoints}>
                        <View style={[styles.cardPointBox, styles.cardOrderColor]}>
                            <Text style={styles.cardBoxLabel}>Orders</Text>
                            <Text style={styles.cardBoxValue}>24</Text>
                        </View>
                        <View style={[styles.cardPointBox, styles.cardPointsColor]}>
                            <Text style={styles.cardBoxLabel}>Points</Text>
                            <Text style={styles.cardBoxValue}>1,250</Text>
                        </View>
                    </View>
                </View>

                {/* SECCIÓN DEL FORMULARIO */}
                <View style={styles.sectionCard}>
                    <Text style={styles.personalHeader}>Personal Information</Text>

                    <CustomInput
                        label="NAME"
                        placeholder="Full name"
                        value={name}
                        onChangeText={(text) => handleChange("name", text)}
                        errorMessage={errors.name}
                    />

                    <CustomInput
                        label="LAST NAME"
                        placeholder="Last name"
                        value={lastName}
                        onChangeText={(text) => handleChange("lastName", text)}
                        errorMessage={errors.lastName}
                    />

                    <CustomInput
                        label="PHONE NUMBER"
                        placeholder="Phone number"
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={(text) => handleChange("phone", text)}
                        errorMessage={errors.phone}
                    />

                    <TouchableOpacity
                        style={styles.updateButton}
                        onPress={handleUpdateUser}
                        disabled={isUpdating}
                    >
                        {isUpdating ? (
                            <ActivityIndicator color="#FFF" size="small" />
                        ) : (
                            <>
                                <Ionicons
                                    name="checkmark-circle-outline"
                                    size={20}
                                    color="#FFF"
                                    style={{ marginRight: 8 }}
                                />
                                <Text style={styles.updateButtonText}>Save Changes</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: "#F3F4F6",
    },
    logoText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#005C3A",
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    profileCard: {
        backgroundColor: "#FFF",
        borderRadius: 16,
        alignItems: "center",
        paddingVertical: 24,
        paddingHorizontal: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    imageWrapper: {
        position: "relative",
        marginBottom: 14,
    },
    profileAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    cameraBtn: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#005C3A",
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 16,
        borderWidth: 2,
        borderColor: "#FFF",
    },
    profileName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 4,
    },
    profileSubtitle: {
        fontSize: 13,
        color: "#6B7280",
        marginBottom: 20,
    },
    cardPoints: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
    },
    cardPointBox: {
        flex: 1,
        height: 64,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 6,
    },
    cardOrderColor: {
        backgroundColor: "#DBEAFE",
    },
    cardPointsColor: {
        backgroundColor: "#E2F0FC",
    },
    cardBoxLabel: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#4B5563",
        letterSpacing: 1,
        marginBottom: 4,
    },
    cardBoxValue: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#047857",
    },
    sectionCard: {
        backgroundColor: "#FFF",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
    },
    personalHeader: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 18,
    },
    updateButton: {
        flexDirection: "row",
        backgroundColor: "#005C3A",
        borderRadius: 12,
        height: 48,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    updateButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});