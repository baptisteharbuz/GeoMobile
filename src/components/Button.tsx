import React from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { ButtonStyles } from "./styles/ButtonStyle";
interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: "primary" | "secondary" | "danger";
    size?: "small" | "medium" | "large";
}

export default function Button({ title, variant = "primary", size = "medium", style, ...props }: ButtonProps) {
    return (
        <TouchableOpacity style={[ButtonStyles.button, ButtonStyles[variant], ButtonStyles[size], style]} {...props}>
            <Text style={[ButtonStyles.text, ButtonStyles[`${variant}Text`]]}>{title}</Text>
        </TouchableOpacity>
    );
}
