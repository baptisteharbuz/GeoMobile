import AsyncStorage from '@react-native-async-storage/async-storage';
import Mapbox from '@rnmapbox/maps';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MarkerModal from '../components/MarkerModal';
import { useMarkerModal } from '../hooks/useMarkerModal';
import { Marker } from '../types/Marker';
import { filterMapboxLogs, initializeMapbox } from '../utils/mapboxConfig';

// Initialiser MapBox et filtrer les logs
initializeMapbox();
filterMapboxLogs();

interface MapScreenProps {
  style?: any;
  latitude?: number;
  longitude?: number;
}

export default function MapScreen({ style, latitude, longitude }: Readonly<MapScreenProps>) {
  const insets = useSafeAreaInsets();
  const [markers, setMarkers] = useState<Marker[]>([]);
  const animatedScale = useRef(new Animated.Value(1)).current;
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const [draggedMarkerId, setDraggedMarkerId] = useState<string | null>(null);

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

  const handleMarkerDragStart = (markerId: string) => {
    setDraggedMarkerId(markerId);
    console.log(`🫳 Début du déplacement du marqueur ${markerId}`);
  };

  const handleMarkerDragEnd = (markerId: string, coordinate: number[]) => {
    const [longitude, latitude] = coordinate;
    console.log(`📍 Marqueur ${markerId} déplacé vers:`, latitude.toFixed(6), longitude.toFixed(6));
    
    // Mettre à jour la position du marqueur
    const updated = markers.map(m => 
      m.id === markerId 
        ? { ...m, latitude, longitude }
        : m
    );
    setMarkers(updated);
    saveMarkers(updated);
    setDraggedMarkerId(null);
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
    <View style={styles.container}>
      <StatusBar style="dark" />
      {/* Barre de coordonnées */}
      <View style={[styles.coordinatesBar, { top: insets.top + 10 }]}>
        <Text style={styles.coordinatesText}>
          📍 Lat: {latitude?.toFixed(6)} | Lon: {longitude?.toFixed(6)}
        </Text>
      </View>

      <Mapbox.MapView
        style={[styles.map, style]}
        styleURL={Mapbox.StyleURL.Street}
        onPress={handleMapPress}
        logoEnabled={false}
        attributionEnabled={false}
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
            id={`marker-${marker.id}`}
            coordinate={[marker.longitude, marker.latitude]}
            title={marker.title}
            onSelected={() => openEditModal(marker)}
            draggable={true}
            onDragStart={() => handleMarkerDragStart(marker.id)}
            onDragEnd={(feature) => handleMarkerDragEnd(marker.id, feature.geometry.coordinates)}
          >
            <Animated.View style={[
              styles.markerWrap, 
              recentlyAddedId === marker.id ? { transform: [{ scale: animatedScale }] } : undefined
            ]}>
              <View style={[
                styles.marker, 
                draggedMarkerId === marker.id && styles.markerDragging
              ]} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  coordinatesBar: {
    position: 'absolute',
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
  markerDragging: {
    backgroundColor: '#4CAF50',
    transform: [{ scale: 1.2 }],
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
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
