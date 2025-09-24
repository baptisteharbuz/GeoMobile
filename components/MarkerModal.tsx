import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Alert, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SelectedLocation } from '../types/Marker';

interface MarkerModalProps {
  visible: boolean;
  mode: 'create' | 'edit';
  title: string;
  observation: string;
  imageUrl: string;
  selectedLocation: SelectedLocation | null;
  onTitleChange: (title: string) => void;
  onObservationChange: (observation: string) => void;
  onImageUrlChange: (url: string) => void;
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
  selectedLocation,
  onTitleChange,
  onObservationChange,
  onImageUrlChange,
  onSave,
  onDelete,
  onCancel,
}: Readonly<MarkerModalProps>) {
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission requise', 'L\'accès à la bibliothèque est nécessaire.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onImageUrlChange(result.assets[0].uri);
      }
    } catch (error) {
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
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={onCancel}
        >
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {mode === 'create' ? '📍 Nouvelle Position' : '✏️ Modifier le point'}
          </Text>
          
          {selectedLocation && (
            <View style={styles.coordinatesContainer}>
              <Text style={styles.coordinateText}>
                Latitude: {selectedLocation.latitude.toFixed(6)}
              </Text>
              <Text style={styles.coordinateText}>
                Longitude: {selectedLocation.longitude.toFixed(6)}
              </Text>
            </View>
          )}

          <View style={styles.form}>
            <Text style={styles.inputLabel}>Nom</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={onTitleChange}
              placeholder="Nom du point"
            />
            <Text style={styles.inputLabel}>Observation</Text>
             <TextInput
               style={styles.input}
               value={observation}
               onChangeText={onObservationChange}
               placeholder="Observation"
             />
            <Text style={styles.inputLabel}>Image</Text>
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              <Text style={styles.imageButtonText}>
                {imageUrl ? '📷 Changer l\'image' : '📷 Sélectionner une image'}
              </Text>
            </TouchableOpacity>
            {imageUrl ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: imageUrl }} style={styles.preview} />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => onImageUrlChange('')}
                >
                  <Text style={styles.removeImageText}>✕</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.buttonText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.addButton]}
              onPress={onSave}
            >
              <Text style={[styles.buttonText, styles.addButtonText]}>
                Enregistrer
              </Text>
            </TouchableOpacity>
            
            {mode === 'edit' && (
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={onDelete}
              >
                <Text style={[styles.buttonText, styles.addButtonText]}>
                  Supprimer
                </Text>
              </TouchableOpacity>
            )}
          </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  coordinatesContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  coordinateText: {
    fontSize: 14,
    fontFamily: 'monospace',
    marginBottom: 5,
  },
  form: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 12,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  imageButton: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#f8f9ff',
  },
  imageButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  imageContainer: {
    position: 'relative',
    marginTop: 8,
  },
  preview: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    backgroundColor: '#f4f4f4',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  addButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  addButtonText: {
    color: 'white',
  },
});