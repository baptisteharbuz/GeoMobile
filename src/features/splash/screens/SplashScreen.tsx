import { Entypo } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { SplashStyle } from "../styles/SplashStyle";

export default function SplashScreen() {
    return (
        <View style={SplashStyle.container}>
            <StatusBar style="light" />
            <Entypo name="globe" size={80} color="white" style={SplashStyle.logo} />
            <Text style={SplashStyle.title}>WildWatch</Text>
            <Text style={SplashStyle.subtitle}>Observation de la faune sauvage</Text>
        </View>
    );
}
