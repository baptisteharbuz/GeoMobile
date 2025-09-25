import React from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";
import { InputStyle } from "./styles/InputStyle";
interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: any;
}

export default function Input({ label, error, containerStyle, style, ...props }: InputProps) {
    return (
        <View style={[InputStyle.container, containerStyle]}>
            {label && <Text style={InputStyle.label}>{label}</Text>}
            <TextInput style={[InputStyle.input, error && InputStyle.inputError, style]} placeholderTextColor="#999" {...props} />
            {error && <Text style={InputStyle.errorText}>{error}</Text>}
        </View>
    );
}
