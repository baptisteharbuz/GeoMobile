import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';

export const useCurrentPosition = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const getLocationData = async () => {
    try {
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      console.log('📍 Position:', position.coords.latitude, position.coords.longitude);

      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    } catch (error) {
      console.error('Erreur obtention position:', error);
    }
  };

  const requestPermission = useCallback(async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(status === 'granted');

      if (status === 'granted') {
        await getLocationData();
      }
    } catch (error) {
      console.error('Erreur demande permission:', error);
      setHasPermission(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  return { location, loading, hasPermission, requestPermission };
};
