import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../components/Button';

interface ErrorScreenProps {
  onRetry: () => void;
}

export default function ErrorScreen({ onRetry }: Readonly<ErrorScreenProps>) {
  const insets = useSafeAreaInsets();
  
  const openSettings = () => {
    Linking.openSettings();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <StatusBar style="dark" />
      <Text style={styles.errorIcon}>🚫</Text>
      <Text style={styles.title}>Localisation requise</Text>
      <Text style={styles.description}>
        Cette application a besoin d&apos;accéder à votre position pour fonctionner correctement.
      </Text>
      <Text style={styles.instructions}>
        Pour activer la localisation :
      </Text>
      <Text style={styles.steps}>
        1. Appuyez sur &quot;Ouvrir les paramètres&quot;{'\n'}
        2. Activez la localisation pour cette app{'\n'}
        3. Revenez à l&apos;application
      </Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="📍 Réessayer" 
          onPress={onRetry}
          variant="primary"
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="⚙️ Ouvrir les paramètres" 
          onPress={openSettings}
          variant="secondary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F8F8F8',
  },
  errorIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  instructions: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
    color: '#333',
  },
  steps: {
    fontSize: 14,
    color: '#555',
    marginBottom: 32,
    textAlign: 'left',
    lineHeight: 20,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 12,
  },
});
