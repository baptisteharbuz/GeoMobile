import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Mapbox from '@rnmapbox/maps';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MarkerModal from '../../marker/components/MarkerModal';
import { useMarkerModal } from '../../marker/hooks/useMarkerModal';
import { Marker } from '../../marker/types/Marker';
import { Mapstyles } from '../styles/MapStyle';
import { filterMapboxLogs, initializeMapbox } from '../utils/mapboxConfig';

initializeMapbox();
filterMapboxLogs();

interface MapScreenProps {
  style?: any;
  latitude?: number;
  longitude?: number;
}

export default function MapScreen({ style, latitude, longitude }: Readonly<MapScreenProps>) {
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<Mapbox.Camera>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [markerAnimations, setMarkerAnimations] = useState<{[key: string]: Animated.Value}>({});
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const [draggedMarkerId, setDraggedMarkerId] = useState<string | null>(null);
  const [iconsReady, setIconsReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await FontAwesome5.loadFont?.();
      } finally {
        setIconsReady(true);
      }
    })();
  }, []);

  const handleSaveMarker = (marker: Marker) => {
    const updated = [...markers, marker];
    setMarkers(updated);
    saveMarkers(updated);
    setRecentlyAddedId(marker.id);
    
    const newAnimation = new Animated.Value(0.1);
    setMarkerAnimations(prev => ({
      ...prev,
      [marker.id]: newAnimation
    }));
        
    Animated.timing(newAnimation, {
      toValue: 1, 
      duration: 3000,
      useNativeDriver: true
    }).start((finished) => {
      setTimeout(() => {
        setRecentlyAddedId(null);
        setMarkerAnimations(prev => {
          const newAnimations = { ...prev };
          delete newAnimations[marker.id];
          return newAnimations;
        });
      }, 1000);
    });
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
  };

  const handleMarkerDragEnd = (markerId: string, coordinate: number[]) => {
    const [longitude, latitude] = coordinate;
    
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
    formDate,
    openCreateModal,
    openEditModal,
    handleSave,
    handleDelete,
    closeModal,
    setFormTitle,
    setFormObservation,
    setFormImageUrl,
    setFormDate,
  } = useMarkerModal(markers, handleSaveMarker, handleUpdateMarker, handleDeleteMarker);

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

  const handleMapPress = (event: any) => {
    let coords: [number, number] | undefined = event?.geometry?.coordinates
      || event?.features?.[0]?.geometry?.coordinates
      || event?.coordinates;

    if (!coords || typeof coords[0] !== 'number' || typeof coords[1] !== 'number') {
      return;
    }

    Haptics.impactAsync?.(Haptics.ImpactFeedbackStyle.Medium).catch(() => {
      Haptics.selectionAsync?.().catch(() => {});
    });

    openCreateModal({
      longitude: coords[0],
      latitude: coords[1],
    });
  };

  const centerOnUserLocation = () => {
    if (latitude && longitude && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: [longitude, latitude],
        zoomLevel: 15,
        animationDuration: 1000,
      });
    }
  };

  if (!latitude || !longitude) {
    return null;
  }

  const coordinates: [number, number] = [longitude, latitude];

  return (
    <View style={Mapstyles.container}>
      <StatusBar style="dark" />
      {/* Barre de coordonnées */}
      <View style={[Mapstyles.coordinatesBar, { top: insets.top + 10 }]}>
        <Text style={Mapstyles.coordinatesText}>
          📍 Lat: {latitude?.toFixed(6)} | Lon: {longitude?.toFixed(6)}
        </Text>
      </View>

      <Mapbox.MapView
        style={[Mapstyles.map, style]}
        styleURL={Mapbox.StyleURL.Street}
        onPress={handleMapPress}
        logoEnabled={false}
        attributionEnabled={false}
      >
            <Mapbox.Camera
              ref={cameraRef}
              centerCoordinate={coordinates}
              zoomLevel={13}
            />
        
        <Mapbox.LocationPuck 
          visible={true}
          puckBearingEnabled={true}
          puckBearing="heading"
        />

        {/* Marqueurs sauvegardés (attendre les icônes) */}
        {iconsReady && markers.map((marker) => (
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
                    Mapstyles.markerWrap,
                    markerAnimations[marker.id] ? { transform: [{ scale: markerAnimations[marker.id] }] } : undefined
                  ]}>
                    <View style={Mapstyles.markerContainer}>
                      <View style={[
                        Mapstyles.markerPin,
                        draggedMarkerId === marker.id && Mapstyles.markerPinDragging
                      ]}>
                        <FontAwesome5
                          name="map-marker-alt"
                          solid
                          size={24}
                          color={draggedMarkerId === marker.id ? '#ff6b6b' : '#e74c3c'}
                        />
                      </View>
                      <Text style={Mapstyles.markerLabel} numberOfLines={1}>{marker.title}</Text>
                    </View>
                  </Animated.View>
          </Mapbox.PointAnnotation>
        ))}
      </Mapbox.MapView>

      {/* Bouton pour centrer sur la position utilisateur */}
      <TouchableOpacity 
        style={[Mapstyles.centerButton, { bottom: insets.bottom + 10, right: 20 }]}
        onPress={centerOnUserLocation}
      >
        <Entypo name="location" size={24} color="#007AFF" />
      </TouchableOpacity>

        <MarkerModal
          visible={modalVisible}
          mode={modalMode}
          title={formTitle}
          observation={formObservation}
          imageUrl={formImageUrl}
          date={formDate}
          selectedLocation={selectedLocation}
          onTitleChange={setFormTitle}
          onObservationChange={setFormObservation}
          onImageUrlChange={setFormImageUrl}
          onDateChange={setFormDate}
          onSave={handleSave}
          onDelete={handleDelete}
          onCancel={closeModal}
        />
    </View>
  );
}
