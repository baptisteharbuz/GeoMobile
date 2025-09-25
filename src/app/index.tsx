import React from 'react';
import ErrorScreen from '../features/error/screens/ErrorScreen';
import { useCurrentPosition } from '../features/map/hooks/useCurrentPosition';
import MapScreen from '../features/map/screens/MapScreen';
import SplashScreen from '../features/splash/screens/SplashScreen';

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
