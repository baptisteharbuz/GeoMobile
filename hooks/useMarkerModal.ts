import { useState } from 'react';
import { Alert } from 'react-native';
import { Marker, SelectedLocation } from '../types/Marker';

export const useMarkerModal = (
  markers: Marker[],
  onSaveMarker: (marker: Marker) => void,
  onUpdateMarker: (markerId: string, updates: Partial<Marker>) => void,
  onDeleteMarker: (markerId: string) => void
) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingMarkerId, setEditingMarkerId] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formObservation, setFormObservation] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');

  const openCreateModal = (location: SelectedLocation) => {
    setSelectedLocation(location);
    setFormTitle(`Point ${markers.length + 1}`);
    setFormObservation('');
    setFormImageUrl('');
    setModalMode('create');
    setEditingMarkerId(null);
    setModalVisible(true);
  };

  const openEditModal = (marker: Marker) => {
    setModalMode('edit');
    setEditingMarkerId(marker.id);
    setFormTitle(marker.title);
    setFormObservation(marker.observation || '');
    setFormImageUrl(marker.imageUrl || '');
    setSelectedLocation({ latitude: marker.latitude, longitude: marker.longitude });
    setModalVisible(true);
  };

  const handleSave = () => {
    if (modalMode === 'create' && selectedLocation) {
      const newMarker: Marker = {
        id: Date.now().toString(),
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        title: formTitle || `Point ${markers.length + 1}`,
        observation: formObservation || undefined,
        imageUrl: formImageUrl || undefined,
        createdAt: new Date().toISOString(),
      };
      onSaveMarker(newMarker);
      closeModal();
      Alert.alert('✅', 'Position sauvegardée !');
    }
    
    if (modalMode === 'edit' && editingMarkerId) {
      onUpdateMarker(editingMarkerId, {
        title: formTitle,
        observation: formObservation || undefined,
        imageUrl: formImageUrl || undefined,
      });
      closeModal();
    }
  };

  const handleDelete = () => {
    if (!editingMarkerId) return;
    onDeleteMarker(editingMarkerId);
    closeModal();
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedLocation(null);
    setEditingMarkerId(null);
    setFormTitle('');
    setFormObservation('');
    setFormImageUrl('');
  };

  return {
    // States
    modalVisible,
    modalMode,
    selectedLocation,
    formTitle,
    formObservation,
    formImageUrl,
    
    // Actions
    openCreateModal,
    openEditModal,
    handleSave,
    handleDelete,
    closeModal,
    
    // Form handlers
    setFormTitle,
    setFormObservation,
    setFormImageUrl,
  };
};
