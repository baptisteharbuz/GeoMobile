import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Image, Keyboard, KeyboardAvoidingView, Modal, Platform, ScrollView, Share, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import { MarkerStyle } from '../styles/MarkerStyle';
import { SelectedLocation } from '../types/Marker';
interface MarkerModalProps {
  visible: boolean;
  mode: 'create' | 'edit';
  title: string;
  observation: string;
  imageUrl: string;
  date: string;
  selectedLocation: SelectedLocation | null;
  onTitleChange: (title: string) => void;
  onObservationChange: (observation: string) => void;
  onImageUrlChange: (url: string) => void;
  onDateChange: (date: string) => void;
  onSave: () => void;
  onDelete: () => void;
  onCancel: () => void;
}

export default function MarkerModal({
  visible,
  mode,
  title,
  observation,
  imageUrl,
  date,
  selectedLocation,
  onTitleChange,
  onObservationChange,
  onImageUrlChange,
  onDateChange,
  onSave,
  onDelete,
  onCancel,
}: Readonly<MarkerModalProps>) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const shareObservation = async () => {
    try {
      const shareMessage = `🌿 Observation WildWatch 🌿

📍 ${title}
📝 ${observation || 'Aucune observation'}
📅 ${date ? new Date(date).toLocaleDateString('fr-FR') : 'Date non définie'}
🗺️ Position: ${selectedLocation?.latitude.toFixed(6)}, ${selectedLocation?.longitude.toFixed(6)}

Partagé depuis WildWatch - Observation de la faune sauvage`;

      await Share.share({
        message: shareMessage,
        title: `Observation: ${title}`,
      });
    } catch (error) {
      console.log('Partage annulé ou erreur:', error);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission requise', 'L\'accès à la bibliothèque est nécessaire.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images' as const,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onImageUrlChange(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Erreur', 'Impossible de sélectionner l\'image');
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={MarkerStyle.container}
        >
          <View style={MarkerStyle.modalOverlay}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <ScrollView 
                style={MarkerStyle.scrollView}
                contentContainerStyle={MarkerStyle.scrollContent}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled"
              >
                <TouchableWithoutFeedback onPress={() => {}}>
                  <View style={MarkerStyle.modalContent}>
                <View style={MarkerStyle.modalHeader}>
                  <Text style={MarkerStyle.modalTitle}>
                    {mode === 'create' ? '📍 Nouvelle Position' : '✏️ Modifier le point'}
                  </Text>
                  <TouchableOpacity style={MarkerStyle.closeButton} onPress={onCancel}>
                    <Text style={MarkerStyle.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
          
          {selectedLocation && (
            <View style={MarkerStyle.coordinatesContainer}>
              <Text style={MarkerStyle.coordinateText}>
                Latitude: {selectedLocation.latitude.toFixed(6)}
              </Text>
              <Text style={MarkerStyle.coordinateText}>
                Longitude: {selectedLocation.longitude.toFixed(6)}
              </Text>
            </View>
          )}

          <View style={MarkerStyle.form}>
            <Input
              label="Nom"
              value={title}
              onChangeText={onTitleChange}
              placeholder="Nom du point"
            />
                      <Input
                        label="Observation"
                        value={observation}
                        onChangeText={onObservationChange}
                        placeholder="Observation"
                        multiline
                      />
                      
                      <Text style={MarkerStyle.dateLabel}>Date d&apos;observation</Text>
                      <TouchableOpacity 
                        style={MarkerStyle.dateButton} 
                        onPress={() => setShowDatePicker(true)}
                      >
                        <Text style={MarkerStyle.dateButtonText}>
                          {date ? new Date(date).toLocaleDateString('fr-FR') : '📅 Sélectionner une date'}
                        </Text>
                      </TouchableOpacity>

                      {showDatePicker && (
                        <DateTimePicker
                          value={date ? new Date(date) : new Date()}
                          onChange={(event: any, selectedDate?: Date) => {
                            if (Platform.OS === 'android') {
                              setShowDatePicker(false);
                            }
                            if (selectedDate) {
                              onDateChange(selectedDate.toISOString());
                            }
                          }}
                          mode="date"
                          display={Platform.OS === 'ios' ? 'compact' : 'default'}
                          style={Platform.OS === 'ios' ? { height: 120 } : undefined}
                        />
                      )}

                      {Platform.OS === 'ios' && showDatePicker && (
                        <TouchableOpacity
                          style={MarkerStyle.dateCloseButton}
                          onPress={() => setShowDatePicker(false)}
                        >
                          <Text style={MarkerStyle.dateCloseText}>Fermer</Text>
                        </TouchableOpacity>
                      )}
                      
                      <Text style={MarkerStyle.imageLabel}>Image</Text>
            <TouchableOpacity style={MarkerStyle.imageButton} onPress={pickImage}>
              <Text style={MarkerStyle.imageButtonText}>
                {imageUrl ? '📷 Changer l&apos;image' : '📷 Sélectionner une image'}
              </Text>
            </TouchableOpacity>
            {imageUrl ? (
              <View style={MarkerStyle.imageContainer}>
                <Image source={{ uri: imageUrl }} style={MarkerStyle.preview} />
                <TouchableOpacity 
                  style={MarkerStyle.removeImageButton}
                  onPress={() => onImageUrlChange('')}
                >
                  <Text style={MarkerStyle.removeImageText}>✕</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>

                          <View style={MarkerStyle.modalButtons}>
                            <Button
                              title="Annuler"
                              variant="secondary"
                              onPress={onCancel}
                              style={MarkerStyle.button}
                            />

                            <Button
                              title="Enregistrer"
                              variant="primary"
                              onPress={onSave}
                              style={MarkerStyle.button}
                            />

                            {mode === 'edit' && (
                              <>
                                <Button
                                  title="Partager"
                                  variant="primary"
                                  onPress={shareObservation}
                                  style={[MarkerStyle.button, MarkerStyle.shareButton]}
                                />
                                <Button
                                  title="Supprimer"
                                  variant="danger"
                                  onPress={onDelete}
                                  style={MarkerStyle.button}
                                />
                              </>
                            )}
                          </View>
                  </View>
                </TouchableWithoutFeedback>
              </ScrollView>
            </TouchableWithoutFeedback>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}