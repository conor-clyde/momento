// src/components/layout/PhotoCard.tsx
// ============================================================================
// PHOTO CARD - Individual photo thumbnail with navigation
// ============================================================================

import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { colors, typography } from "../../constants/theme";
import { Moment } from "../../types";
import { hasImage } from "../../utils";
import { Icon } from "../ui/Icon";
import { Text } from "../ui/Text";

interface PhotoCardProps {
  moment: Moment;
  showFavoriteIndicator?: boolean;
}

export function PhotoCard({ moment, showFavoriteIndicator = true }: PhotoCardProps) {
  const [imageError, setImageError] = useState(false);
  const imageUri = moment.imageUri;
  const hasValidImage = hasImage(imageUri);
  const showPlaceholder = imageError || !hasValidImage;

  // Reset error state when URI changes
  useEffect(() => {
    setImageError(false);
  }, [imageUri]);

  return (
    <Link href={`/moment/${moment.id}`} asChild>
      <Pressable style={styles.container}>
        {showPlaceholder ? (
          <View style={styles.placeholder}>
            <Icon name="sparkles" size={16} color={colors.primary.main} />
            <Text style={styles.placeholderText}>Moment{"\n"}Captured</Text>
          </View>
        ) : (
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" onError={() => setImageError(true)}
          />
        )}
        {showFavoriteIndicator && moment.isFavorite && (
          <View style={styles.favoriteBadge}>
            <Icon name="heart" size={12} color={colors.accent.coral} />
          </View>
        )}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.background.light,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  placeholderText: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    fontWeight: typography.weight.semibold,
    textAlign: "center",
    lineHeight: 14,
  },
  favoriteBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: colors.background.card,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
