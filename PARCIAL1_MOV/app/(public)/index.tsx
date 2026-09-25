import React from "react";
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLogin } from "@/src/auth/viewmodels/use-login";

export default function LoginScreen() {
    const {
        trainerId,
        secretCode,
        setTrainerId,
        setSecretCode,
        isLoading,
        errorMessage,
        isSecretCodeVisible,
        toggleSecretCodeVisibility,
        handleLogin,
    } = useLogin();

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Tarjeta Flotante Principal */}
                <View style={styles.card}>
                    {/* Logo Pokebola */}
                    <View style={styles.logoWrapper}>
                        <Image
                            source={{ uri: 'https://external-preview.redd.it/in-what-way-is-the-pok%C3%A9ball-copyrighted-v0-PClAYBkvPq7RUIgNFzzRE0DfIlATFZRI6oIMgCitVNg.jpg?auto=webp&s=05b7b712948288c437ba4e4925be9c215ef58577' }}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Encabezado */}
                    <Text style={styles.title}>Pokedex</Text>
                    <Text style={styles.subtitle}>Welcome back, Trainer. Please log in.</Text>

                    {/* Mensaje de Error */}
                    {errorMessage && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{errorMessage}</Text>
                        </View>
                    )}

                    {/* Input: Trainer ID */}
                    <Text style={styles.label}>Trainer ID</Text>
                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons
                            name="card-account-details-outline"
                            size={20}
                            color="#8B5E3C"
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. ASH-151"
                            placeholderTextColor="#9CA3AF"
                            autoCapitalize="characters"
                            value={trainerId}
                            onChangeText={setTrainerId}
                        />
                    </View>

                    {/* Input: Secret Code */}
                    <Text style={styles.label}>Secret Code</Text>
                    <View style={styles.inputContainer}>
                        <Feather name="more-horizontal" size={20} color="#8B5E3C" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#9CA3AF"
                            secureTextEntry={!isSecretCodeVisible}
                            value={secretCode}
                            onChangeText={setSecretCode}
                        />
                        <TouchableOpacity onPress={toggleSecretCodeVisibility} style={styles.eyeButton}>
                            <Feather
                                name={isSecretCodeVisible ? "eye" : "eye-off"}
                                size={18}
                                color="#9CA3AF"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Botón Principal de Login */}
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#CC0000" style={styles.loader} />
                    ) : (
                        <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin} activeOpacity={0.85}>
                            <Text style={styles.buttonText}>Log In</Text>
                            <Feather name="arrow-right" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    )}

                    {/* Enlace de Recuperación */}
                    <TouchableOpacity style={styles.forgotButton}>
                        <Text style={styles.forgotText}>Forgot your Code?</Text>
                    </TouchableOpacity>

                    {/* Línea decorativa inferior con degradado de franjas */}
                    <View style={styles.rainbowStripeContainer}>
                        <View style={[styles.stripe, { backgroundColor: "#EF4444" }]} />
                        <View style={[styles.stripe, { backgroundColor: "#F59E0B" }]} />
                        <View style={[styles.stripe, { backgroundColor: "#10B981" }]} />
                        <View style={[styles.stripe, { backgroundColor: "#3B82F6" }]} />
                        <View style={[styles.stripe, { backgroundColor: "#8B5CF6" }]} />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 0,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
        borderWidth: 1,
        borderColor: "#F1F5F9",
    },
    logoWrapper: {
        alignSelf: "center",
        backgroundColor: "#FFFFFF",
        padding: 10,
        borderRadius: 50,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    logoImage: {
        width: 55,
        height: 55,
        transform: [{ rotate: '-25deg' }],
    },
    title: {
        fontSize: 26,
        fontWeight: "800",
        color: "#B91C1C",
        textAlign: "center",
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        color: "#7A5E5B",
        textAlign: "center",
        marginBottom: 24,
        fontWeight: "bold",
    },
    label: {
        fontSize: 14,
        fontWeight: "700",
        color: "#1E293B",
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1.5,
        borderColor: "#FCA5A5",
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 48,
        marginBottom: 18,
        backgroundColor: "#FAFAFA",
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: "100%",
        fontSize: 15,
        color: "#1E293B",
    },
    eyeButton: {
        padding: 4,
    },
    buttonLogin: {
        backgroundColor: "#B91C1C",
        height: 48,
        borderRadius: 24,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 8,
        marginBottom: 18,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
        marginRight: 8,
    },
    loader: {
        marginVertical: 12,
    },
    forgotButton: {
        alignItems: "center",
        marginBottom: 28,
    },
    forgotText: {
        color: "#2563EB",
        fontSize: 14,
        fontWeight: "600",
    },
    rainbowStripeContainer: {
        flexDirection: "row",
        height: 3,
        marginHorizontal: -24,
    },
    stripe: {
        flex: 1,
        height: "100%",
    },
    errorContainer: {
        backgroundColor: "#FEE2E2",
        borderWidth: 1,
        borderColor: "#FCA5A5",
        borderRadius: 8,
        padding: 10,
        marginBottom: 16,
    },
    errorText: {
        color: "#B91C1C",
        fontSize: 13,
        textAlign: "center",
        fontWeight: "500",
    },
});