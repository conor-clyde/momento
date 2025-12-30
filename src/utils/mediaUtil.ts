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
    // Try to save the image directly - Expo will request permissions if needed
    await MediaLibrary.createAssetAsync(imageUri);
    return true;
  } catch (error: any) {
    console.error("Error saving photo to camera roll:", error);

    // If it fails due to permissions, show a helpful message
    if (error.message?.includes("permission") || error.message?.includes("denied")) {
      Alert.alert(
        "Permission Required",
        "To save photos to your camera roll, please grant media access permission. You can do this in Settings > Apps > Momento > Permissions.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Open Settings",
            onPress: () => {
              // Note: We can't directly open app settings on Android from here
              // The user will need to go to settings manually
            },
          },
        ]
      );
    } else {
      Alert.alert(
        "Error",
        "Failed to save photo to camera roll. Please try again."
      );
    }
    return false;
  }
}