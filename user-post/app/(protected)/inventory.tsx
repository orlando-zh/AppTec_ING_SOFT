import { CategoryService } from "@/app/src/categories/services/category.service";
import { useAuth } from "@/app/src/context/AuthContext";
import { CustomInput } from "@/components/CustomInput";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import React, { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function InventoryScreen() {
  const router = useRouter();
  const { token } = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Estado centralizado para mensajes de error
  const [errors, setErrors] = useState({
    name: "",
    description: "",
  });

  // solo letras y espacios 
  const categoryNameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;

  // Validación y bloqueo mediante componente
  const handleChange = (field: "name" | "description", value: string) => {
    let newErrors = { ...errors };

    if (field === "name") {
      if (!categoryNameRegex.test(value)) {
        newErrors.name = "El nombre de la categoría solo debe contener letras.";
      } else {
        newErrors.name = "";
        setName(value);
      }
    }

    if (field === "description") {
      setDescription(value);
      if (!value.trim()) {
        newErrors.description = "La descripción no puede estar vacía.";
      } else if (value.trim().length < 5) {
        newErrors.description = "La descripción debe tener al menos 5 caracteres.";
      } else {
        newErrors.description = "";
      }
    }

    setErrors(newErrors);
  };

  // Validación de barrera previa al envío
  const handleSaveCategory = async () => {
    const isNameEmpty = !name.trim();
    const isDescriptionEmpty = !description.trim();
    const hasActiveErrors = Boolean(errors.name || errors.description);

    if (isNameEmpty || isDescriptionEmpty || hasActiveErrors) {
      setErrors({
        name: isNameEmpty ? "El nombre de la categoría es obligatorio." : errors.name,
        description: isDescriptionEmpty ? "La descripción es obligatoria." : errors.description,
      });

      Alert.alert(
        "Formulario inválido",
        "Por favor completa todos los campos correctamente y corrige los errores antes de continuar."
      );
      return;
    }

    if (!token) {
      Alert.alert("Error de sesión", "No se encontró el token de autenticación.");
      return;
    }

    setIsLoading(true);

    try {
      const newCategory = await CategoryService.createCategory(name, description, token);
      console.log("Categoría creada recibida:", newCategory);

      Alert.alert(
        "Categoría creada",
        `La categoría "${newCategory.name}" se guardó exitosamente`,
        [
          {
            text: "Aceptar",
            onPress: () => {
              setName("");
              setDescription("");
              setErrors({ name: "", description: "" });
              router.replace("/(protected)/dashboard");
            }
          }
        ]
      );
    } catch (error: any) {
      console.log("Error al guardar categoría:", error);
      Alert.alert("Error", error.message || "No se pudo guardar la categoría");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Drawer.Screen
        options={{
          headerShown: false,
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              router.replace('/(protected)/dashboard' as any);
            }}
          >
            <Ionicons name="arrow-back-outline" size={26} color="#000" />
          </TouchableOpacity>

          <View style={styles.titleWrapper}>
            <Text style={styles.headerTitle}>ADMIN PORTAL</Text>
            <Text style={styles.headerSubtitle}>Nueva Categoría</Text>
          </View>

          <TouchableOpacity>
            <View style={styles.boxIconContainer}>
              <Ionicons name="archive-outline" size={22} color="#006C47" />
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.logoText}>
            Ingresa los datos esenciales para catalogar los productos en el inventario
          </Text>

          <View style={styles.formCard}>
            <CustomInput
              label="Nombre de la categoría"
              placeholder="Ej. Dulceria"
              value={name}
              onChangeText={(text) => handleChange("name", text)}
              errorMessage={errors.name}
              editable={!isLoading}
            />

            <CustomInput
              label="Descripción"
              placeholder="Describe los productos que engloban esta categoría"
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
              value={description}
              onChangeText={(text) => handleChange("description", text)}
              errorMessage={errors.description}
              editable={!isLoading}
              style={styles.textArea}
            />

            <TouchableOpacity
              onPress={handleSaveCategory}
              disabled={isLoading}
              style={styles.btnSave}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <>
                  <Ionicons
                    style={styles.checkIcon}
                    name="checkmark-outline"
                    size={22}
                    color="#FFF"
                  />
                  <Text style={styles.btnSaveText}>Guardar Categoría</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnCancel}
              onPress={() => router.replace('/(protected)/dashboard' as any)}
              disabled={isLoading}
            >
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#F9FAFB',
  },
  titleWrapper: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    letterSpacing: 0.8,
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#006C47',
  },
  boxIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  logoText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 24,
  },
  formCard: {
    backgroundColor: '#FFF',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 15,
    elevation: 2,
  },
  textArea: {
    minHeight: 90,
    paddingTop: 10,
  },
  btnSave: {
    backgroundColor: '#006C47',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 10,
    marginBottom: 16,
  },
  checkIcon: {
    marginRight: 8,
  },
  btnSaveText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  btnCancel: {
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnCancelText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
});