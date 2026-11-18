import { useCreateProduct } from "@/app/src/products/viewmodels/use-create-product";
import { CustomInput } from "@/components/CustomInput";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateProductScreen() {
    const router = useRouter();
    const {
        name,
        setName,
        categoryId,
        setCategoryId,
        sku,
        setSku,
        description,
        setDescription,
        regularPrice,
        setRegularPrice,
        offerPrice,
        setOfferPrice,
        initialStock,
        setInitialStock,
        minStockAlert,
        setMinStockAlert,
        isLoadingProduct,
        errorMessage,
        submitProduct,
        categories,
        isLoadingCategories,
        isCategoriesShowModal,
        setIsCategoriesShowModal,
        selectedCategoryName,
        setSelectedCategoryName,
    } = useCreateProduct();

    // Estado centralizado para mensajes de error
    const [errors, setErrors] = useState({
        name: "",
        category: "",
        sku: "",
        description: "",
        regularPrice: "",
        offerPrice: "",
        initialStock: "",
        minStockAlert: "",
    });

    // Expresiones regulares para control estricto de tipos de datos
    const textOnlyRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/; // Bloquea números en campos de texto
    const integerRegex = /^[0-9]*$/; // Solo enteros para inventario
    const decimalRegex = /^\d*\.?\d*$/; // Solo números decimales para precios
    const skuRegex = /^[a-zA-Z0-9-]*$/; // Código alfanumérico con guiones

    // Validación en tiempo real y bloqueo de caracteres no permitidos
    const handleChange = (
        field: "name" | "sku" | "description" | "regularPrice" | "offerPrice" | "initialStock" | "minStockAlert",
        value: string
    ) => {
        let newErrors = { ...errors };

        switch (field) {
            case "name":
                // Requerimiento 1: Rechazo inmediato de números en el nombre
                if (!textOnlyRegex.test(value)) {
                    newErrors.name = "El nombre del producto no debe contener números.";
                } else {
                    newErrors.name = "";
                    setName(value);
                }
                break;

            case "sku":
                if (!skuRegex.test(value)) {
                    newErrors.sku = "El SKU solo permite caracteres alfanuméricos y guiones.";
                } else {
                    newErrors.sku = "";
                    setSku(value.toUpperCase());
                }
                break;

            case "description":
                setDescription(value);
                if (value.trim().length > 0 && value.trim().length < 10) {
                    newErrors.description = "La descripción debe tener al menos 10 caracteres.";
                } else {
                    newErrors.description = "";
                }
                break;

            case "regularPrice":
                if (!decimalRegex.test(value)) {
                    newErrors.regularPrice = "El precio solo debe contener números y punto decimal.";
                } else {
                    newErrors.regularPrice = "";
                    setRegularPrice(value);

                    // Validación cruzada: Si ya hay un precio de oferta, revisa que siga siendo válido
                    if (offerPrice && parseFloat(offerPrice) >= parseFloat(value)) {
                        newErrors.offerPrice = "El precio de oferta debe ser menor al precio regular.";
                    } else {
                        newErrors.offerPrice = "";
                    }
                }
                break;

            case "offerPrice":
                if (!decimalRegex.test(value)) {
                    newErrors.offerPrice = "El precio de oferta solo debe contener números y punto.";
                } else {

                    const numericOffer = parseFloat(value);
                    const numericRegular = parseFloat(regularPrice);


                    if (regularPrice && numericOffer >= numericRegular) {
                        newErrors.offerPrice = "El precio de oferta debe ser menor al precio regular.";
                    } else {
                        newErrors.offerPrice = "";
                    }

                    setOfferPrice(value);
                }
                break;

            case "initialStock":
                // Rechazo inmediato de letras o símbolos en el stock
                if (!integerRegex.test(value)) {
                    newErrors.initialStock = "El stock inicial solo debe contener números enteros.";
                } else {
                    newErrors.initialStock = "";
                    setInitialStock(value);
                }
                break;

            case "minStockAlert":
                if (!integerRegex.test(value)) {
                    newErrors.minStockAlert = "El stock mínimo solo debe contener números enteros.";
                } else {
                    newErrors.minStockAlert = "";
                    setMinStockAlert(value);
                }
                break;
        }

        setErrors(newErrors);
    };

    // Validación de barrera previa a guardar el producto
    const onSubmitProduct = async () => {
        const isNameEmpty = !name.trim();
        const isCategoryEmpty = !categoryId;
        const isPriceEmpty = !regularPrice.trim();
        const isInitialStockEmpty = !initialStock.trim();
        const isMinStockEmpty = !minStockAlert.trim();

        const hasActiveErrors = Boolean(
            errors.name ||
            errors.sku ||
            errors.description ||
            errors.regularPrice ||
            errors.offerPrice ||
            errors.initialStock ||
            errors.minStockAlert
        );

        if (
            isNameEmpty ||
            isCategoryEmpty ||
            isPriceEmpty ||
            isInitialStockEmpty ||
            isMinStockEmpty ||
            hasActiveErrors
        ) {
            setErrors((prev) => ({
                ...prev,
                name: isNameEmpty ? "El nombre del producto es obligatorio." : prev.name,
                category: isCategoryEmpty ? "Debes seleccionar una categoría." : prev.category,
                regularPrice: isPriceEmpty ? "El precio regular es obligatorio." : prev.regularPrice,
                initialStock: isInitialStockEmpty ? "El stock inicial es obligatorio." : prev.initialStock,
                minStockAlert: isMinStockEmpty ? "El stock mínimo es obligatorio." : prev.minStockAlert,
            }));

            Alert.alert(
                "Formulario inválido",
                "Por favor completa todos los campos obligatorios y corrige los errores antes de continuar."
            );
            return;
        }

        // Si pasa todas las validaciones locales, envía la petición
        await submitProduct();
    };

    return (
        <SafeAreaView style={styles.container}>
            <Drawer.Screen options={{ headerShown: false }} />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.replace("/(protected)/dashboard")}>
                        <Ionicons name="arrow-back-outline" size={26} />
                    </TouchableOpacity>
                    <View style={styles.titleWrapper}>
                        <Text style={styles.headerTitle}>ADMIN PORTAL</Text>
                        <Text style={styles.headerSubtitle}>Nuevo Producto</Text>
                    </View>
                </View>

                <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Error global retornado por el backend si falla */}
                    {errorMessage && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{errorMessage}</Text>
                        </View>
                    )}

                    {/* TARJETA 1: INFORMACIÓN GENERAL */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Feather
                                name="clipboard"
                                size={20}
                                color="#006C47"
                                style={{ marginRight: 10 }}
                            />
                            <Text style={styles.cardTitle}>Información General</Text>
                        </View>

                        <CustomInput
                            label="Nombre del producto"
                            placeholder="Ej. Zapato Deportivo"
                            value={name}
                            onChangeText={(text) => handleChange("name", text)}
                            errorMessage={errors.name}
                        />

                        {/* SELECTOR DE CATEGORÍA */}
                        <View style={styles.selectorGroup}>
                            <Text style={styles.inputLabel}>Categoría</Text>
                            <TouchableOpacity
                                style={[
                                    styles.selectorInput,
                                    errors.category ? styles.selectorInputError : null,
                                ]}
                                onPress={() => setIsCategoriesShowModal(true)}
                            >
                                <Text
                                    style={{
                                        color: selectedCategoryName ? "#111827" : "#9CA3AF",
                                        fontSize: 15,
                                    }}
                                >
                                    {selectedCategoryName || "Selecciona la categoría"}
                                </Text>
                                <Feather name="chevron-down" size={20} color="#6B7280" />
                            </TouchableOpacity>
                            {errors.category ? (
                                <Text style={styles.errorTextSmall}>{errors.category}</Text>
                            ) : null}
                        </View>

                        <CustomInput
                            label="SKU / Código de Barra"
                            placeholder="PR-787878"
                            autoCapitalize="characters"
                            value={sku}
                            onChangeText={(text) => handleChange("sku", text)}
                            errorMessage={errors.sku}
                        />

                        <CustomInput
                            label="Descripción Detallada"
                            placeholder="Describe los atributos principales, materiales, confección..."
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            maxLength={2000}
                            value={description}
                            onChangeText={(text) => handleChange("description", text)}
                            errorMessage={errors.description}
                            style={styles.textArea}
                        />

                        <View style={styles.charCounterDescription}>
                            <Text style={styles.counterText}>{description.length}/2000</Text>
                        </View>
                    </View>

                    {/* TARJETA 2: PRECIOS E INVENTARIO */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Feather
                                name="dollar-sign"
                                size={20}
                                color="#006C47"
                                style={{ marginRight: 10 }}
                            />
                            <Text style={styles.cardTitle}>Precios e Inventario</Text>
                        </View>

                        <View style={styles.rowCols}>
                            <View style={styles.col}>
                                <CustomInput
                                    label="Precio Regular ($)"
                                    placeholder="0.00"
                                    keyboardType="numeric"
                                    value={regularPrice}
                                    onChangeText={(text) => handleChange("regularPrice", text)}
                                    errorMessage={errors.regularPrice}
                                />
                            </View>

                            <View style={styles.col}>
                                <CustomInput
                                    label="Precio Oferta ($)"
                                    placeholder="0.00"
                                    keyboardType="numeric"
                                    value={offerPrice}
                                    onChangeText={(text) => handleChange("offerPrice", text)}
                                    errorMessage={errors.offerPrice}
                                />
                            </View>
                        </View>

                        <View style={styles.rowCols}>
                            <View style={styles.col}>
                                <CustomInput
                                    label="Stock Inicial"
                                    placeholder="50"
                                    keyboardType="numeric"
                                    value={initialStock}
                                    onChangeText={(text) => handleChange("initialStock", text)}
                                    errorMessage={errors.initialStock}
                                />
                            </View>

                            <View style={styles.col}>
                                <CustomInput
                                    label="Stock Mínimo"
                                    placeholder="5"
                                    keyboardType="numeric"
                                    value={minStockAlert}
                                    onChangeText={(text) => handleChange("minStockAlert", text)}
                                    errorMessage={errors.minStockAlert}
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.btnSave}
                            onPress={onSubmitProduct}
                            disabled={isLoadingProduct}
                        >
                            {isLoadingProduct ? (
                                <ActivityIndicator color="#FFF" size="small" />
                            ) : (
                                <>
                                    <Ionicons
                                        style={styles.checkIcon}
                                        name="checkmark-outline"
                                        size={22}
                                        color="#FFF"
                                    />
                                    <Text style={styles.btnSaveText}>Guardar Producto</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.btnCancel}
                            onPress={() => router.replace("/(protected)/dashboard")}
                            disabled={isLoadingProduct}
                        >
                            <Text style={styles.btnCancelText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* MODAL DE CATEGORÍAS */}
            <Modal
                visible={isCategoriesShowModal}
                transparent
                animationType="slide"
                onRequestClose={() => setIsCategoriesShowModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Seleccionar Categoría</Text>
                            <TouchableOpacity onPress={() => setIsCategoriesShowModal(false)}>
                                <Feather name="x" size={22} color="#374151" />
                            </TouchableOpacity>
                        </View>

                        {isLoadingCategories ? (
                            <ActivityIndicator size="large" color="#006C47" />
                        ) : (
                            <FlatList
                                data={categories}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => {
                                    const isSelected = item.id === categoryId;
                                    return (
                                        <TouchableOpacity
                                            style={[
                                                styles.categoryOption,
                                                isSelected && styles.categoryOptionSelected,
                                            ]}
                                            onPress={() => {
                                                setCategoryId(item.id);
                                                setSelectedCategoryName(item.name);
                                                setErrors((prev) => ({ ...prev, category: "" }));
                                                setIsCategoriesShowModal(false);
                                            }}
                                        >
                                            <Text
                                                style={[
                                                    styles.categoryOptionText,
                                                    isSelected && styles.categoryOptionTextSelected,
                                                ]}
                                            >
                                                {item.name}
                                            </Text>
                                            {isSelected && (
                                                <Feather name="check" size={18} color="#006C47" />
                                            )}
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: "#F9FAFB",
    },
    titleWrapper: {
        flex: 1,
        marginLeft: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111827",
        letterSpacing: 0.8,
    },
    headerSubtitle: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#006C47",
        marginTop: 2,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#111827",
    },
    card: {
        backgroundColor: "#FFF",
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 2,
    },
    selectorGroup: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: "500",
        color: "#374151",
        marginBottom: 5,
    },
    selectorInput: {
        height: 48,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 14,
        borderColor: "#ccc",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FFF",
    },
    selectorInputError: {
        borderColor: "red",
        borderWidth: 1.5,
    },
    errorTextSmall: {
        color: "red",
        fontSize: 12,
        marginTop: 5,
    },
    textArea: {
        minHeight: 100,
        paddingTop: 10,
    },
    charCounterDescription: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: -10,
        marginBottom: 10,
    },
    counterText: {
        fontSize: 12,
        color: "#9CA3AF",
    },
    rowCols: {
        flexDirection: "row",
        gap: 12,
    },
    col: {
        flex: 1,
    },
    btnSave: {
        backgroundColor: "#006C47",
        height: 48,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        marginTop: 8,
    },
    checkIcon: {
        marginRight: 8,
    },
    btnSaveText: {
        color: "#FFF",
        fontSize: 15,
        fontWeight: "bold",
    },
    btnCancel: {
        height: 24,
        justifyContent: "center",
        alignItems: "center",
    },
    btnCancelText: {
        fontSize: 14,
        color: "#6B7280",
        fontWeight: "500",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "#FFFFFF",
        padding: 20,
        maxHeight: "60%",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#111827",
    },
    categoryOption: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    categoryOptionSelected: {
        backgroundColor: "#ECFDF5",
    },
    categoryOptionText: {
        fontSize: 16,
        color: "#374151",
    },
    categoryOptionTextSelected: {
        color: "#006C47",
        fontWeight: "600",
    },
    errorContainer: {
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: "#FEE2E2",
        borderColor: "#FCA5A5",
        marginBottom: 16,
        padding: 12,
    },
    errorText: {
        fontSize: 14,
        textAlign: "center",
        color: "#DC2626",
        fontWeight: "500",
    },
});