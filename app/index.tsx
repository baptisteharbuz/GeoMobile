import React from 'react';
import { useCurrentPosition } from '../hooks/useCurrentPosition';
import ErrorScreen from '../screens/ErrorScreen';
import MapScreen from '../screens/MapScreen';
import SplashScreen from '../screens/SplashScreen';

export default function Index() {
  const { location, loading, hasPermission, requestPermission } = useCurrentPosition();

  // Écran de chargement/splash
  if (loading) {
    return <SplashScreen />;
  }

  // Écran d'erreur si permission refusée
  if (hasPermission === false) {
    return <ErrorScreen onRetry={requestPermission} />;
  }

  // Écran principal avec la carte
  return (
    <MapScreen 
      latitude={location?.latitude} 
      longitude={location?.longitude}
    />
  );
}
