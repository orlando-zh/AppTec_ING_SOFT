import React from "react";
import { Tabs, useRouter } from "expo-router";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function ProtectedLayout() {
    const router = useRouter();

    const handleLogout = () => {
        router.replace("/(public)");
    };

    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                headerTitleAlign: "left",
                headerTitle: () => <Text style={styles.headerTitle}>Pokedex</Text>,
                headerStyle: styles.headerBackground,
                headerShadowVisible: false,
                headerRight: () => (
                    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                        <Feather name="log-out" size={24} color="#1E293B" />
                    </TouchableOpacity>
                ),
                tabBarStyle: styles.tabBar,
                tabBarShowLabel: false,
                tabBarActiveTintColor: "#B91C1C",
                tabBarInactiveTintColor: "#1E293B",
            }}
        >
            <Tabs.Screen
                name="grid"
                options={{
                    tabBarIcon: ({ color }) => <Feather name="grid" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    headerBackground: {
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: "#1E293B",
        marginLeft: 16
    },
    logoutButton: {
        padding: 8,
        marginRight: 16
    },
    tabBar: {
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "#F1F5F9",
        height: 60
    }
});