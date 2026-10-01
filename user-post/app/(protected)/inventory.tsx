import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function InventoryScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Oculta la cabecera por defecto del Drawer para usar la personalizada */}
      <Drawer.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* Manejo de teclado para evitar que tape inputs en iOS y Android */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        {/* Cabecera personalizada */}
        <View style={styles.header}>
          {/* Botón Volver */}
          <TouchableOpacity
            onPress={() => {
              router.replace('/(protected)/dashboard' as any);
            }}
          >
            <Ionicons name="arrow-back-outline" size={26} color="#000" />
          </TouchableOpacity>

          {/* Títulos del Header */}
          <View style={styles.titleWrapper}>
            <Text style={styles.headerTitle}>ADMIN PORTAL</Text>
            <Text style={styles.headerSubtitle}>Nueva Categoría</Text>
          </View>

          {/* Icono decorativo / acción a la derecha */}
          <TouchableOpacity>
            <View style={styles.boxIconContainer}>
              <Ionicons name="archive-outline" size={22} color="#006C47" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Formulario con Scroll */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.logoText}>
            Ingresa los datos esenciales para catalogar los productos en el inventario
          </Text>

          <View style={styles.formCard}>
            {/* Campo de Nombre */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nombre de la categoria</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ej. Dulceria"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Campo de Descripción */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Descripcion</Text>
              <TextInput
                style={styles.textAreaInput}
                placeholder="Describe los productos que engloban esta categoria"
                placeholderTextColor="#9CA3AF"
                multiline={true}
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>

            {/* Botón Guardar */}
            <TouchableOpacity style={styles.btnSave}>
              <Ionicons style={styles.checkIcon} name="checkmark-outline" size={20} color="#FFF" />
              <Text style={styles.btnSaveText}>Guardar Categoria</Text>
            </TouchableOpacity>

            {/* Botón Cancelar (Corregido a texto plano) */}
            <TouchableOpacity style={styles.btnCancel}>
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
  inputGroup: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    fontSize: 14,
    borderRadius: 10,
  },
  textAreaInput: {
    height: 120,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
  },
  btnSave: {
    backgroundColor: '#006C47',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginBottom: 16,
  },
  checkIcon: {
    marginRight: 8,
  },
  btnSaveText: {
    color: '#FFF',
    fontSize: 15,
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