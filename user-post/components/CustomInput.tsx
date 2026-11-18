import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';

interface CustomInputProps extends TextInputProps {
    label: string;
    errorMessage?: string;
    isPassword?: boolean;
}

export const CustomInput: React.FC<CustomInputProps> = ({
    label,
    errorMessage,
    isPassword = false,
    ...props
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(!isPassword);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>

            <View style={[styles.inputContainer, errorMessage ? styles.inputError : null]}>
                <TextInput
                    style={styles.input}
                    secureTextEntry={!isPasswordVisible}
                    placeholderTextColor="#999"
                    {...props}
                />

                {isPassword && (
                    <TouchableOpacity
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        style={styles.iconContainer}
                    >
                        <Ionicons
                            name={isPasswordVisible ? "eye-off" : "eye"}
                            size={24}
                            color="#666"
                        />
                    </TouchableOpacity>
                )}
            </View>

            {/* Manejo de errores claro */}
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginBottom: 15 },
    label: { fontSize: 16, marginBottom: 5, color: '#333', fontWeight: '500' },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    inputError: { borderColor: 'red', borderWidth: 1.5 },
    input: { flex: 1, padding: 12, fontSize: 16 },
    iconContainer: { padding: 10 },
    errorText: { color: 'red', fontSize: 12, marginTop: 5 },
});