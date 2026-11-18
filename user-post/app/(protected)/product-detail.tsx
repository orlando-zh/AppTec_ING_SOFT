import { ProductItem } from "@/app/src/products/models/product.model";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useMemo, useState } from "react";
import {
    Image,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TECHNICAL_SPECS = [
    { label: "Distribución", value: "75% Compacta (82 Teclas)" },
    { label: "Keycaps", value: "PBT Doble Inyección OEM" },
    { label: "Tasa de Sondeo", value: "1000Hz (2.4Ghz y Cable)" },
    { label: "Capacidad de Batería", value: "4000 mAh Li-ion" },
    { label: "Peso", value: "860 gramos" },
];

export default function ProductDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ product?: string }>();
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(true);
    const [isSpecsExpanded, setIsSpecsExpanded] = useState(true);

    const product: ProductItem | null = useMemo(() => {
        if (!params.product) return null;

        try {
            return JSON.parse(params.product) as ProductItem;
        } catch {
            return null;
        }
    }, [params.product]);

    const handleBack = () => {
        router.replace("/(protected)/dashboard");
    };

    if (!product) {
        return (
            <SafeAreaView style={styles.container}>
                <Drawer.Screen options={{ headerShown: false }} />
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={handleBack}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={24} color="#111827" />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={styles.storeNameText}>ShopEase</Text>
                    </View>
                    <View style={styles.headerRightSpacer} />
                </View>
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>
                        No se encontró la información del producto.
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    const offerPrice = product.offerPrice ?? 0;
    const initialStock = product.initialStock ?? 0;
    const hasOffer = offerPrice > 0 && offerPrice < product.regularPrice;
    const discountPercentage = hasOffer
        ? Math.round(
            ((product.regularPrice - offerPrice) / product.regularPrice) * 100
        )
        : 0;
    const currentPrice = hasOffer ? offerPrice : product.regularPrice;
    const isInStock = initialStock > 0;

    const handleShare = async () => {
        try {
            await Share.share({
                message: `${product.name} - $${currentPrice.toFixed(2)} en ShopEase`,
            });
        } catch (error) {
            console.log("Error al compartir producto:", error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Drawer.Screen options={{ headerShown: false }} />

            {/* Barra de Navegación Superior */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBack}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>

                <View style={styles.headerCenter}>
                    <Text style={styles.categoryHeaderText} numberOfLines={1}>
                        {product.categoryName}
                    </Text>
                    <Text style={styles.storeNameText}>ShopEase</Text>
                </View>

                <View style={styles.headerRightSpacer} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Tarjeta de Producto e Imagen */}
                <View style={styles.imageCard}>
                    <View style={styles.imageWrapper}>
                        <Image
                            source={{ uri: product.imageUrl }}
                            style={styles.productImage}
                            resizeMode="cover"
                        />

                        {/* Etiquetas flotantes superiores */}
                        <View style={styles.floatingOverlay} pointerEvents="box-none">
                            <View style={styles.leftBadges}>
                                {hasOffer && (
                                    <View style={styles.discountBadge}>
                                        <Ionicons
                                            name="flash-outline"
                                            size={13}
                                            color="#FFFFFF"
                                        />
                                        <Text style={styles.discountBadgeText}>
                                            -{discountPercentage}% OFF
                                        </Text>
                                    </View>
                                )}

                                <View style={styles.officialBadge}>
                                    <MaterialCommunityIcons
                                        name="check-decagram-outline"
                                        size={15}
                                        color="#005C3A"
                                    />
                                    <Text style={styles.officialBadgeText}>
                                        Oficial
                                    </Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.shareButton}
                                onPress={handleShare}
                                activeOpacity={0.8}
                            >
                                <Ionicons
                                    name="share-social-outline"
                                    size={19}
                                    color="#374151"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Etiquetas de Stock y Envío */}
                <View style={styles.statusBadgesContainer}>
                    <View
                        style={[
                            styles.stockBadge,
                            !isInStock && styles.outOfStockBadge,
                        ]}
                    >
                        <View
                            style={[
                                styles.stockDot,
                                !isInStock && styles.outOfStockDot,
                            ]}
                        />
                        <Text
                            style={[
                                styles.stockBadgeText,
                                !isInStock && styles.outOfStockText,
                            ]}
                        >
                            {isInStock
                                ? `En Stock (${initialStock} disponibles)`
                                : "Sin Stock"}
                        </Text>
                    </View>

                    <View style={styles.shippingBadge}>
                        <MaterialCommunityIcons
                            name="motorbike"
                            size={15}
                            color="#374151"
                        />
                        <Text style={styles.shippingBadgeText}>
                            Envío Motorizado Hoy
                        </Text>
                    </View>
                </View>

                {/* Sección de Títulos y Precios */}
                <Text style={styles.productTitle}>{product.name}</Text>

                <View style={styles.priceCard}>
                    <View style={styles.priceRow}>
                        <Text style={styles.currentPrice}>
                            ${currentPrice.toFixed(2)}
                        </Text>
                        {hasOffer && (
                            <Text style={styles.originalPrice}>
                                ${product.regularPrice.toFixed(2)}
                            </Text>
                        )}
                    </View>
                </View>

                {/* Tarjeta 1: Descripción del Producto */}
                <View style={styles.sectionCard}>
                    <TouchableOpacity
                        style={styles.sectionHeader}
                        onPress={() =>
                            setIsDescriptionExpanded((prev) => !prev)
                        }
                        activeOpacity={0.7}
                    >
                        <Text style={styles.sectionTitle}>
                            Descripción del Producto
                        </Text>
                        <Feather
                            name={
                                isDescriptionExpanded
                                    ? "chevron-up"
                                    : "chevron-down"
                            }
                            size={20}
                            color="#374151"
                        />
                    </TouchableOpacity>

                    {isDescriptionExpanded && (
                        <Text style={styles.descriptionText}>
                            {product.description?.trim() ||
                                "Sin descripción disponible."}
                        </Text>
                    )}
                </View>

                {/* Tarjeta 2: Ficha Técnica Completa */}
                <View style={styles.sectionCard}>
                    <TouchableOpacity
                        style={styles.sectionHeader}
                        onPress={() => setIsSpecsExpanded((prev) => !prev)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.sectionTitle}>
                            Ficha Técnica Completa
                        </Text>
                        <Feather
                            name={
                                isSpecsExpanded ? "chevron-up" : "chevron-down"
                            }
                            size={20}
                            color="#374151"
                        />
                    </TouchableOpacity>

                    {isSpecsExpanded && (
                        <View style={styles.specsList}>
                            {TECHNICAL_SPECS.map((spec, index) => (
                                <View
                                    key={spec.label}
                                    style={[
                                        styles.specRow,
                                        index < TECHNICAL_SPECS.length - 1 &&
                                            styles.specRowBorder,
                                    ]}
                                >
                                    <Text style={styles.specLabel}>
                                        {spec.label}
                                    </Text>
                                    <Text style={styles.specValue}>
                                        {spec.value}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>
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
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "flex-start",
    },
    headerCenter: {
        flex: 1,
        alignItems: "center",
    },
    categoryHeaderText: {
        fontSize: 13,
        color: "#374151",
        fontWeight: "500",
    },
    storeNameText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#005C3A",
    },
    headerRightSpacer: {
        width: 40,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 32,
    },
    imageCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 14,
        marginBottom: 18,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
    },
    imageWrapper: {
        width: "100%",
        height: 290,
        borderRadius: 14,
        overflow: "hidden",
        backgroundColor: "#F3F4F6",
        position: "relative",
    },
    productImage: {
        width: "100%",
        height: "100%",
    },
    floatingOverlay: {
        position: "absolute",
        top: 12,
        left: 12,
        right: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    leftBadges: {
        gap: 8,
        alignItems: "flex-start",
    },
    discountBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#3FA66C",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 5,
    },
    discountBadgeText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "bold",
    },
    officialBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.94)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 5,
    },
    officialBadgeText: {
        color: "#006540ff",
        fontSize: 12,
        fontWeight: "600",
    },
    shareButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "rgba(255, 255, 255, 0.94)",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    statusBadgesContainer: {
        alignItems: "flex-start",
        gap: 8,
        marginBottom: 14,
    },
    stockBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#C6F6D5",
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 16,
        gap: 6,
    },
    outOfStockBadge: {
        backgroundColor: "#FEE2E2",
    },
    stockDot: {
        width: 7,
        height: 7,
        borderRadius: 3.5,
        backgroundColor: "#059669",
    },
    outOfStockDot: {
        backgroundColor: "#DC2626",
    },
    stockBadgeText: {
        color: "#065F46",
        fontSize: 12,
        fontWeight: "600",
    },
    outOfStockText: {
        color: "#B91C1C",
    },
    shippingBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#DBEAFE",
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 16,
        gap: 6,
    },
    shippingBadgeText: {
        color: "#374151",
        fontSize: 12,
        fontWeight: "600",
    },
    productTitle: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#111827",
        lineHeight: 33,
        marginBottom: 16,
    },
    priceCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        paddingHorizontal: 20,
        paddingVertical: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "baseline",
        gap: 10,
    },
    currentPrice: {
        fontSize: 34,
        fontWeight: "bold",
        color: "#005C3A",
    },
    originalPrice: {
        fontSize: 16,
        color: "#6B7280",
        textDecorationLine: "line-through",
    },
    sectionCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        padding: 20,
        marginTop: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#111827",
    },
    descriptionText: {
        fontSize: 14,
        lineHeight: 22,
        color: "#4B5563",
        marginTop: 14,
    },
    specsList: {
        marginTop: 10,
    },
    specRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 13,
    },
    specRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    specLabel: {
        fontSize: 14,
        color: "#6B7280",
    },
    specValue: {
        fontSize: 14,
        fontWeight: "600",
        color: "#111827",
        textAlign: "right",
        flexShrink: 1,
        marginLeft: 12,
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    emptyStateText: {
        fontSize: 15,
        color: "#6B7280",
        textAlign: "center",
    },
});

