// ============================================================================
// MEDIA UTILITIES - Save photos to device camera roll
// ============================================================================
import * as MediaLibrary from "expo-media-library";
import { Alert } from "react-native";

/**
 * Saves a photo to the device's camera roll
 * Requests proper permission on Android/iOS if needed
 * @param imageUri - URI of the image to save
 * @returns true if successful, false otherwise
 */
export async function savePhotoToCameraRoll(imageUri: string): Promise<boolean> {
  try {
    // Request permission only if needed
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Please enable media access in Settings to save photos. This allows saving images to your camera roll."
      );
      return false;
    }

    // Save the image
    await MediaLibrary.createAssetAsync(imageUri);
    return true;
  } catch (error: any) {
    console.error("Error saving photo to camera roll:", error);
    Alert.alert(
      "Error",
      "Failed to save photo to camera roll. Please try again."
    );
    return false;
  }
}