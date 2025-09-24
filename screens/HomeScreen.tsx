import React from 'react';
import { ActivityIndicator, Button, Linking, StyleSheet, Text, View } from 'react-native';
import CustomMapView from '../components/MapView';
import { useCurrentPosition } from '../hooks/useCurrentPosition';

export default function HomeScreen() {
  const { location, loading, hasPermission, requestPermission } = useCurrentPosition();

  // Écran de chargement
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.text}>Obtention de votre position...</Text>
      </View>
    );
  }

  // Écran d'autorisation refusée
  if (hasPermission === false) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>🚫</Text>
        <Text style={styles.title}>Localisation requise</Text>
        <Text style={styles.text}>
          Cette application a besoin d&apos;accéder à votre position pour fonctionner correctement.
        </Text>
        <Text style={styles.subText}>
          Appuyez sur le bouton ci-dessous pour autoriser l&apos;accès à votre localisation.
        </Text>
        <View style={styles.buttonContainer}>
          <Button 
            title="📍 Autoriser la localisation" 
            onPress={requestPermission}
            color="#007AFF"
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button 
            title="⚙️ Ouvrir les paramètres" 
            onPress={() => Linking.openSettings()}
            color="#666"
          />
        </View>
      </View>
    );
  }

  // Écran principal avec coordonnées et carte
  return (
    <View style={styles.container}>
      <View style={styles.coordinatesBar}>
        <Text style={styles.coordinatesText}>
          📍 Lat: {location?.latitude.toFixed(6)} | Lon: {location?.longitude.toFixed(6)}
        </Text>
      </View>
      <View style={styles.mapContainer}>
        <CustomMapView 
          style={styles.map} 
          latitude={location?.latitude} 
          longitude={location?.longitude}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  coordinatesBar: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  coordinatesText: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  subText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 15,
  },
  mapContainer: {
    flex: 1,
    width: '100%',
  },
  map: {
    flex: 1,
  },
});
