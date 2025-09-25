import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Linking, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../../components/Button';
import { ErrorStyles } from '../styles/ErrorStyle';
interface ErrorScreenProps {
  onRetry: () => void;
}

export default function ErrorScreen({ onRetry }: Readonly<ErrorScreenProps>) {
  const insets = useSafeAreaInsets();
  
  const openSettings = () => {
    Linking.openSettings();
  };

  return (
    <View style={[ErrorStyles.container, { paddingTop: insets.top + 20 }]}>
      <StatusBar style="dark" />
      <Text style={ErrorStyles.errorIcon}>🚫</Text>
      <Text style={ErrorStyles.title}>Localisation requise</Text>
      <Text style={ErrorStyles.description}>
        Cette application a besoin d&apos;accéder à votre position pour fonctionner correctement.
      </Text>
      <Text style={ErrorStyles.instructions}>
        Pour activer la localisation :
      </Text>
      <Text style={ErrorStyles.steps}>
        1. Appuyez sur &quot;Ouvrir les paramètres&quot;{'\n'}
        2. Activez la localisation pour cette app{'\n'}
        3. Revenez à l&apos;application
      </Text>
      
      <View style={ErrorStyles.buttonContainer}>
        <Button 
          title="📍 Réessayer" 
          onPress={onRetry}
          variant="primary"
        />
      </View>
      
      <View style={ErrorStyles.buttonContainer}>
        <Button 
          title="⚙️ Ouvrir les paramètres" 
          onPress={openSettings}
          variant="secondary"
        />
      </View>
    </View>
  );
}