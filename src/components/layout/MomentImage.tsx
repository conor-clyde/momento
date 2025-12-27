// ============================================================================
// MOMENT IMAGE - Reusable image display component (preview or polaroid)
// ============================================================================

import { Icon, Text } from "@/src/components";
import { colors, spacing, typography } from "@/src/constants/theme";
import { hasImage } from "@/src/utils";
import { Image, StyleSheet, View } from "react-native";

interface MomentImageProps {
  imageUri?: string;
  size?: number;
}

export function MomentImage({ imageUri, size = 120 }: MomentImageProps) {
  const showImage = hasImage(imageUri) && imageUri;

  return (
    <View style={styles.previewContainer}>
      <View style={[styles.previewFrame, { width: size, height: size }]}>
        {showImage ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
        ) : (
          <View style={styles.previewPlaceholder}>
            <Icon name="image-outline" size={48} color={colors.text.tertiary} />
            <Text style={styles.placeholderText}>No image</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  previewContainer: {
    alignItems: "center",
    marginBottom: spacing.md,
  },
  previewFrame: {
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: colors.background.light,
    borderWidth: 2,
    borderColor: colors.primary.main,
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  previewPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.light,
    gap: spacing.xs,
  },
  placeholderText: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
    fontWeight: typography.weight.medium,
  },
});

