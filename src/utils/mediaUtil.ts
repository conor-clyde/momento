// ============================================================================
// MEDIA UTILITIES - Save photos to device camera roll
// ============================================================================

import * as MediaLibrary from "expo-media-library";
import { Alert } from "react-native";

/**
 * Saves a photo to the device's camera roll
 * @param imageUri - URI of the image to save
 * @returns true if successful, false otherwise
 */
export async function savePhotoToCameraRoll(imageUri: string): Promise<boolean> {
  try {
    // Check current permissions first
    const currentPermissions = await MediaLibrary.getPermissionsAsync();

    // If we don't have permission, request it
    if (!currentPermissions.granted) {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Momento needs photo library access to save photos. Android groups this with video/audio permissions, but we only save your photos."
        );
        return false;
      }
    }

    // Save to camera roll - this will trigger permission request if needed
    await MediaLibrary.createAssetAsync(imageUri);
    return true;
  } catch (error: any) {
    console.error("Error saving photo to camera roll:", error);

    // Handle specific error cases
    if (error?.message?.includes("permission") || error?.code === "E_MEDIA_LIBRARY_PERMISSION") {
      Alert.alert(
        "Permission Denied",
        "Please enable media access in Settings to save photos. On Android, this permission allows saving photos to your camera roll."
      );
    } else {
      Alert.alert("Error", "Failed to save photo to camera roll. Please try again.");
    }

    return false;
  }
}

