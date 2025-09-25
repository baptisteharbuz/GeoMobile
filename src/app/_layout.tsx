import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Supprimer le header avec le titre
      }}
    />
  );
}
