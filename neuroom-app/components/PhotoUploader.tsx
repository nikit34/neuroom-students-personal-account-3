import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../constants/colors';

interface PhotoUploaderProps {
  photoUri: string | null;
  onPhotoSelected: (uri: string) => void;
  onPhotoRemoved: () => void;
}

export function PhotoUploader({ photoUri, onPhotoSelected, onPhotoRemoved }: PhotoUploaderProps) {
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Нужен доступ', 'Разрешите доступ к камере в настройках');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: false,
    });
    if (!result.canceled && result.assets[0]) {
      onPhotoSelected(result.assets[0].uri);
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: false,
    });
    if (!result.canceled && result.assets[0]) {
      onPhotoSelected(result.assets[0].uri);
    }
  };

  if (photoUri) {
    return (
      <View style={styles.previewContainer}>
        <Image source={{ uri: photoUri }} style={styles.preview} resizeMode="contain" />
        <TouchableOpacity style={styles.removeButton} onPress={onPhotoRemoved} activeOpacity={0.7}>
          <Ionicons name="close-circle" size={32} color={Colors.error} />
        </TouchableOpacity>
        <Text style={styles.previewHint}>Нажмите ✕ чтобы удалить и загрузить заново</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.cameraButton} onPress={takePhoto} activeOpacity={0.8}>
        <View style={styles.cameraIconCircle}>
          <Ionicons name="camera" size={40} color={Colors.primary} />
        </View>
        <Text style={styles.cameraText}>Сделай фото решения</Text>
        <Text style={styles.cameraHint}>Нажми, чтобы открыть камеру</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.galleryButton} onPress={pickFromGallery} activeOpacity={0.7}>
        <Ionicons name="images-outline" size={20} color={Colors.primary} />
        <Text style={styles.galleryText}>Выбрать из галереи</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  cameraButton: {
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
    borderStyle: 'dashed',
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cameraText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  cameraHint: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  galleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  galleryText: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: '500',
  },
  previewContainer: {
    alignItems: 'center',
  },
  preview: {
    width: '100%',
    height: 400,
    borderRadius: 16,
    backgroundColor: Colors.borderLight,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.surface,
    borderRadius: 16,
  },
  previewHint: {
    marginTop: 8,
    fontSize: 13,
    color: Colors.textTertiary,
  },
});
