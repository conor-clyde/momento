import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";

const PHOTOS_DIR = new FileSystem.Directory(FileSystem.Paths.document, "photos");

/**
 * Ensures the photos directory exists
 */
async function ensurePhotosDirectory(): Promise<void> {
  try {
    if (!PHOTOS_DIR.exists) {
      PHOTOS_DIR.create({ intermediates: true, idempotent: true });
    }
  } catch (error) {
    console.error("Error ensuring photos directory:", error);
    throw error;
  }
}

/**
 * Saves a photo from a temporary URI to permanent storage
 * Optimizes image size to reduce storage usage
 * @param tempUri - Temporary URI from camera or image picker
 * @returns Permanent file URI
 */
export async function savePhotoToLocal(tempUri: string): Promise<string> {
  try {
    await ensurePhotosDirectory();

    // Validate source file exists
    const sourceFile = new FileSystem.File(tempUri);
    if (!sourceFile.exists) {
      throw new Error(`Source file does not exist: ${tempUri}`);
    }

    // Optimize image: resize to max 1200px width (maintains aspect ratio)
    // and compress to 70% quality to significantly reduce file size
    // This reduces storage from ~3-5MB per photo to ~300-800KB per photo
    const context = ImageManipulator.ImageManipulator.manipulate(tempUri);
    const imageRef = await context
      .resize({ width: 1200 }) // Max width 1200px (good for mobile displays)
      .renderAsync();
    const manipulatedImage = await imageRef.saveAsync({
      compress: 0.7, // 70% quality (good balance of quality vs size)
      format: ImageManipulator.SaveFormat.JPEG,
    });
    
    // Release shared objects to free up memory
    context.release();
    imageRef.release();

    // Generate unique filename using timestamp
    const filename = `photo_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
    const permanentFile = new FileSystem.File(PHOTOS_DIR, filename);

    // Copy optimized file from temp location to permanent location
    const tempFile = new FileSystem.File(manipulatedImage.uri);
    tempFile.copy(permanentFile);

    return permanentFile.uri;
  } catch (error: any) {
    console.error("Error saving photo:", error);
    throw error;
  }
}

/**
 * Deletes a photo from permanent storage
 * @param uri - File URI to delete
 */
export async function deleteLocalPhoto(uri: string): Promise<void> {
  try {
    // Only delete if it's in our photos directory (safety check)
    if (uri && uri.startsWith(PHOTOS_DIR.uri)) {
      const file = new FileSystem.File(uri);
      if (file.exists) {
        file.delete();
      }
    }
  } catch (error) {
    console.error("Error deleting photo:", error);
    // Don't throw - deletion failures shouldn't break the app
  }
}

/**
 * Deletes a temporary file (e.g., from camera)
 * @param uri - Temporary file URI to delete
 */
export async function deleteTempFile(uri: string): Promise<void> {
  try {
    // Only delete temporary files (not our permanent storage)
    if (uri && !uri.startsWith(PHOTOS_DIR.uri)) {
      const file = new FileSystem.File(uri);
      if (file.exists) {
        file.delete();
      }
    }
  } catch (error) {
    console.error("Error deleting temporary file:", error);
    // Don't throw - deletion failures shouldn't break the app
  }
}

/**
 * Checks if an image file exists at the given URI
 * @param uri - File URI to check
 * @returns true if file exists, false otherwise
 */
export async function imageFileExists(uri: string): Promise<boolean> {
  try {
    if (!uri) return false;
    const file = new FileSystem.File(uri);
    return file.exists;
  } catch (error) {
    console.error("Error checking file existence:", error);
    return false;
  }
}

