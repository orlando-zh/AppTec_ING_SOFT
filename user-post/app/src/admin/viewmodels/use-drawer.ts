import { AdminProfile, DrawerItemOption } from "@/app/src/admin/models/drawer.model";
import { useRouter } from "expo-router";
import { useState } from "react";

export function useDrawer() {
    const router = useRouter();

    const [profile] = useState<AdminProfile>({
        name: "Admin User",
        role: "System management",
        avatarUrl: "https://i.pinimg.com/originals/89/19/cc/8919cc617f8055034f35ca883cd32b89.jpg",
        version: "v4.4.4"
    })

    const navigationOptions: DrawerItemOption[] = [
        { name: "dashboard", label: "Dashboard", icon: "grid" },
        { name: "orders", label: "Orders", icon: "package" },
        {
            name: "inventory",
            label: "Inventory",
            icon: "archive",
            subitems: [
                {
                    name: "inventory",
                    label: "Categories",
                    icon: "folder"
                },
                {
                    name: "create-product",
                    label: "Products",
                    icon: "file-text"
                },
                {
                    name: "create-service",
                    label: "Servicios",
                    icon: "box"
                }
            ]
        },
    ]

    return {
        profile,
        navigationOptions,

    }
}