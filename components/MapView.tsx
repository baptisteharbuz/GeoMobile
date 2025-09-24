import AsyncStorage from '@react-native-async-storage/async-storage';
import Mapbox from '@rnmapbox/maps';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { useMarkerModal } from '../hooks/useMarkerModal';
import { Marker } from '../types/Marker';
import MarkerModal from './MarkerModal';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_PUBLIC_TOKEN!);

interface CustomMapViewProps {
  style?: any;
  latitude?: number;
  longitude?: number;
}



export default function CustomMapView({ style, latitude, longitude }: Readonly<CustomMapViewProps>) {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const animatedScale = useRef(new Animated.Value(1)).current;
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const handleSaveMarker = (marker: Marker) => {
    const updated = [...markers, marker];
    setMarkers(updated);
    saveMarkers(updated);
    setRecentlyAddedId(marker.id);
    animatedScale.setValue(0.2);
    Animated.spring(animatedScale, { toValue: 1, useNativeDriver: true, friction: 5, tension: 120 }).start();
  };

  const handleUpdateMarker = (markerId: string, updates: Partial<Marker>) => {
    const updated = markers.map(m => m.id === markerId ? { ...m, ...updates } : m);
    setMarkers(updated);
    saveMarkers(updated);
  };

  const handleDeleteMarker = (markerId: string) => {
    const updated = markers.filter(m => m.id !== markerId);
    setMarkers(updated);
    saveMarkers(updated);
  };

  const {
    modalVisible,
    modalMode,
    selectedLocation,
    formTitle,
    formObservation,
    formImageUrl,
    openCreateModal,
    openEditModal,
    handleSave,
    handleDelete,
    closeModal,
    setFormTitle,
    setFormObservation,
    setFormImageUrl,
  } = useMarkerModal(markers, handleSaveMarker, handleUpdateMarker, handleDeleteMarker);

  // Charger les marqueurs sauvegardés
  useEffect(() => {
    loadMarkers();
  }, []);

  const loadMarkers = async () => {
    try {
      const saved = await AsyncStorage.getItem('savedMarkers');
      if (saved) {
        setMarkers(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Erreur chargement marqueurs:', error);
    }
  };

  const saveMarkers = async (newMarkers: Marker[]) => {
    try {
      await AsyncStorage.setItem('savedMarkers', JSON.stringify(newMarkers));
    } catch (error) {
      console.error('Erreur sauvegarde marqueurs:', error);
    }
  };

  const handleMapPress = (feature: any) => {
    const coords = feature.geometry.coordinates;
    openCreateModal({
      longitude: coords[0],
      latitude: coords[1],
    });
  };

  if (!latitude || !longitude) {
    return null;
  }

  const coordinates: [number, number] = [longitude, latitude];

  return (
    <>
      <Mapbox.MapView
        style={[styles.map, style]}
        styleURL={Mapbox.StyleURL.Street}
        onPress={handleMapPress}
      >
        <Mapbox.Camera
          centerCoordinate={coordinates}
          zoomLevel={13}
        />
        
        <Mapbox.LocationPuck 
          visible={true}
          puckBearingEnabled={true}
          puckBearing="heading"
        />

        {/* Marqueurs sauvegardés */}
        {markers.map((marker) => (
          <Mapbox.PointAnnotation
            key={marker.id}
            id={marker.id}
            coordinate={[marker.longitude, marker.latitude]}
            title={marker.title}
            onSelected={() => openEditModal(marker)}
          >
            <Animated.View style={[styles.markerWrap, recentlyAddedId === marker.id ? { transform: [{ scale: animatedScale }] } : undefined]}>
              <View style={styles.marker} />
              <Text style={styles.markerLabel} numberOfLines={1}>{marker.title}</Text>
              {marker.imageUrl ? (
                <Image source={{ uri: marker.imageUrl }} style={styles.markerThumb} />
              ) : null}
            </Animated.View>
          </Mapbox.PointAnnotation>
        ))}
      </Mapbox.MapView>

      <MarkerModal
        visible={modalVisible}
        mode={modalMode}
        title={formTitle}
        observation={formObservation}
        imageUrl={formImageUrl}
        selectedLocation={selectedLocation}
        onTitleChange={setFormTitle}
        onObservationChange={setFormObservation}
        onImageUrlChange={setFormImageUrl}
        onSave={handleSave}
        onDelete={handleDelete}
        onCancel={closeModal}
      />
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  marker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF6B6B',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerWrap: {
    alignItems: 'center',
  },
  markerLabel: {
    marginTop: 4,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    maxWidth: 140,
    fontSize: 12,
  },
  markerThumb: {
    width: 36,
    height: 36,
    borderRadius: 6,
    marginTop: 6,
  },
});