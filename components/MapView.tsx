import Mapbox from '@rnmapbox/maps';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import * as Location from 'expo-location';


Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_PUBLIC_TOKEN || '');

interface MapViewProps {
  style?: any;
}

export default function MapView({ style }: MapViewProps) {
  const [location, setLocation] = useState<[number, number]>([2.3522, 48.8566]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Permission d\'accès à la localisation refusée');
        return;
      }

      try {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation([currentLocation.coords.longitude, currentLocation.coords.latitude]);
      } catch {
        Alert.alert('Erreur', 'Impossible d\'obtenir la localisation');
      }
    })();
  }, []);

  return (
    <View style={[styles.container, style]}>
      <Mapbox.MapView style={styles.map}>
        <Mapbox.Camera
          zoomLevel={10}
          centerCoordinate={location}
        />
      </Mapbox.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});