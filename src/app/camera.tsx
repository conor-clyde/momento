import { Button } from "@/src/components/ui/Button";
import { colors, spacing } from "@/src/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as Linking from "expo-linking";
import * as MediaLibrary from "expo-media-library";
import { router } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { ActivityIndicator, Alert, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CaptureScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, setMediaPermission] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const insets = useSafeAreaInsets();

  // Check media library permissions on mount
  React.useEffect(() => {
    const checkMediaPermissions = async () => {
      const { status } = await MediaLibrary.getPermissionsAsync();
      setMediaPermission(status === 'granted');
    };
    checkMediaPermissions();
  }, []);

  // Reset processing state when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setIsProcessing(false);
    }, [])
  );

  // Request camera and media library permissions together
  const handleRequestPermission = async () => {
    try {
      // Request both permissions simultaneously to potentially group them
      const [cameraResult, mediaResult] = await Promise.all([
        requestPermission(),
        MediaLibrary.requestPermissionsAsync()
      ]);

      const cameraGranted = cameraResult.granted;
      const mediaGranted = mediaResult.status === 'granted';

      if ((!cameraGranted || !mediaGranted) && !cameraResult.canAskAgain) {
        Alert.alert(
          "Permissions Required",
          "Camera and photo library access are needed to take and save photos.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => {
                if (Platform.OS === "ios") {
                  Linking.openURL("app-settings:");
                } else {
                  Linking.openSettings();
                }
              },
            },
          ]
        );
      }
    } catch (err) {
      console.error("Permission error:", err);
    }
  };

  // Toggle between front and back camera
  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  // Capture photo
  const handleCapture = async () => {
    if (!cameraRef.current || isProcessing) return;
    
    setIsProcessing(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.6,
        base64: false,
      });

      if (photo?.uri) {
        router.push({
          pathname: "/add",
          params: { imageUri: photo.uri },
        });
      } else {
        throw new Error("No photo URI returned");
      }
    } catch (err) {
      console.error("Capture error:", err);
      Alert.alert("Error", "Failed to capture photo. Please try again.");
      setIsProcessing(false);
    }
  };

  // Skip to add moment without photo
  const handleSkip = () => {
    if (!isProcessing) {
      router.push("/add");
    }
  };

  // Permission screen - check both camera and media permissions
  if (!permission?.granted || mediaPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.permissionCard}>
          <Ionicons
            name={permission ? "camera-outline" : "hourglass-outline"}
            size={64}
            color={colors.primary.main}
          />
          <Text style={styles.permissionTitle}>
            {permission ? "Camera Access Needed" : "Loading..."}
          </Text>
          <Text style={styles.permissionMessage}>
            {permission && mediaPermission !== null
              ? "We need camera and photo library access to take and save photos for your moments."
              : "Checking permissions..."}
          </Text>
          {permission && (
            <Button
              variant="primary"
              text="Grant Permission"
              icon="camera"
              onPress={handleRequestPermission}
            />
          )}
        </View>
      </View>
    );
  }

  // Camera screen
  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} />

      <View style={[styles.controls, { paddingBottom: spacing.xxl + insets.bottom }]}>
        <Button
          variant="ghost"
          icon="camera-reverse"
          iconOnly
          onPress={toggleCameraFacing}
          disabled={isProcessing}
          style={styles.flipButton}
        />

        <Pressable
          style={styles.captureButtonContainer}
          onPress={handleCapture}
          disabled={isProcessing}
        >
          <View style={[styles.captureButton, isProcessing && styles.captureButtonDisabled]}>
            {isProcessing ? (
              <ActivityIndicator size="large" color={colors.text.white} />
            ) : (
              <View style={styles.captureButtonInner} />
            )}
          </View>
        </Pressable>

        <Button
          variant="ghost"
          text="Skip"
          onPress={handleSkip}
          disabled={isProcessing}
          style={styles.skipButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  controls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.lg,
  },
  flipButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  captureButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary.main,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.text.white,
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  skipButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
    backgroundColor: colors.background.main,
  },
  permissionCard: {
    width: "85%",
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: spacing.xxxl,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  permissionMessage: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
});
