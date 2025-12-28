// ============================================================================
// MOMENT DETAIL SCREEN - Quiet & Cozy
// ============================================================================

import { Screen } from "@/src/components";
import { Icon } from "@/src/components/ui/Icon";
import { Text } from "@/src/components/ui/Text";
import { getMoodByValue } from "@/src/constants/moods";
import { colors, shadows, spacing, typography } from "@/src/constants/theme";
import { useMoments } from "@/src/contexts/MomentsContext";
import { formatDateTime, savePhotoToCameraRoll } from "@/src/utils";
import { router, useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import { Alert, Dimensions, Image, Modal, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Responsive image sizing - adjust based on screen size
const getImageSize = () => {
  const maxWidth = Math.min(SCREEN_WIDTH - spacing.lg * 2, 400); // Cap at 400px for very large screens
  const maxHeight = SCREEN_HEIGHT * 0.4; // Don't take more than 40% of screen height
  return Math.min(maxWidth, maxHeight);
};

const IMAGE_SIZE = getImageSize();

export default function MomentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { moments, removeMoment, toggleFavorite } = useMoments();
  const moment = moments.find((m) => m.id === id);
  const [isFullscreenVisible, setIsFullscreenVisible] = useState(false);
  const [isSavingPhoto, setIsSavingPhoto] = useState(false);

  if (!moment) {
    return (
      <Screen>
        <View style={styles.notFoundContainer}>
          <Icon name="alert-circle-outline" size={48} color={colors.text.tertiary} />
          <Text style={styles.notFoundText}>Moment not found</Text>
        </View>
      </Screen>
    );
  }

  const moodInfo = moment.mood ? getMoodByValue(moment.mood) : null;
  const fullDateTime = formatDateTime(moment.createdAt);

  // --- Handlers ---
  const handleToggleFavorite = () => toggleFavorite(moment.id);

  const handleEdit = () => router.push(`/edit/${moment.id}`);


  const handleDelete = () => {
    Alert.alert("Delete Moment", "Are you sure? This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await removeMoment(moment.id);
            router.back();
          } catch {
            Alert.alert("Error", "Failed to delete");
          }
        },
      },
    ]);
  };

  const handleSavePhoto = async () => {
    if (!moment.imageUri) return;
    setIsSavingPhoto(true);
    try {
      const success = await savePhotoToCameraRoll(moment.imageUri);
      if (success) Alert.alert("Success", "Photo saved to camera roll!");
    } catch (error) {
      console.error("Error saving photo:", error);
      Alert.alert("Error", "Failed to save photo");
    } finally {
      setIsSavingPhoto(false);
    }
  };

  const handleShare = async () => {
    try {
      if (moment.imageUri) {
        const isAvailable = await Sharing.isAvailableAsync();
        if (!isAvailable) {
          Alert.alert("Sharing not available", "Sharing is not available on this device.");
          return;
        }
        await Sharing.shareAsync(moment.imageUri);
      } else {
        Alert.alert("No photo to share", "This moment doesn't have a photo to share.");
      }
    } catch (error) {
      console.error("Error sharing moment:", error);
      Alert.alert("Error", "Failed to share moment");
    }
  };


  return (
    <>
      <Screen scrollable={false} edges={["bottom"]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        {/* --- Combined Header and Image Section with Background --- */}
        <View style={styles.headerImageContainer}>
          {/* Header with Title, Date and Favorite - always in white card */}
          <View style={styles.headerContent}>
            {moment.title?.trim() ? (
              <Text style={styles.title}>{moment.title}</Text>
            ) : (
              <Text style={styles.titlePlaceholder}>Untitled Moment</Text>
            )}

            <View style={styles.dateAndFavoriteRow}>
              <Text style={styles.fullDateTime}>{fullDateTime}</Text>

              <TouchableOpacity
                onPress={handleToggleFavorite}
                style={styles.favoriteButton}
                activeOpacity={0.7}
              >
                <Icon
                  name={moment.isFavorite ? "heart" : "heart-outline"}
                  size={24}
                  color={moment.isFavorite ? colors.accent.coral : colors.text.secondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* --- Image Section - extends to screen edges below --- */}
          {moment.imageUri ? (
            <>
              <View style={styles.imageSection}>
                <TouchableOpacity
                  onPress={() => setIsFullscreenVisible(true)}
                  activeOpacity={0.95}
                  style={styles.fullImageContainer}
                >
                  <Image source={{ uri: moment.imageUri }} style={styles.fullImage} resizeMode="cover" />
                  <View style={styles.imageExpandIndicator}>
                    <Icon name="expand-outline" size={16} color={colors.text.white} />
                  </View>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.imageSection}>
              <View style={styles.noImageContainer}>
                <Icon name="camera-outline" size={48} color={colors.text.tertiary} />
                <Text style={styles.noImageText}>No photo captured</Text>
              </View>
            </View>
          )}
        </View>

        {/* --- Combined Mood and Notes Section --- */}
        <View style={styles.contentSection}>
          <View style={styles.contentCard}>
            {moodInfo && (
              <View style={styles.moodSection}>
                <View style={styles.moodHeader}>
                  <Text style={styles.moodLabel}>Feeling</Text>

                </View>
                <View style={styles.moodContent}>
                  <Text style={styles.moodEmoji}>{moodInfo.emoji}</Text>
                  <Text style={styles.moodName}>{moodInfo.label}</Text>
                </View>
              </View>
            )}

            <View style={[styles.notesSection, moodInfo && styles.notesSectionWithMood]}>
              <View style={styles.notesHeader}>

                <Text style={styles.notesTitle}>Notes</Text>
              </View>
              {moment.notes?.trim() ? (
                <Text style={styles.notesContent}>{moment.notes}</Text>
              ) : (
                <Text style={styles.noNotesContent}>No notes written...</Text>
              )}
            </View>
          </View>
        </View>

        {/* --- Enhanced Action Buttons --- */}
        <View style={styles.actionsSection}>
          <View style={styles.primaryActions}>
            <TouchableOpacity
              onPress={handleEdit}
              style={styles.primaryActionButton}
              activeOpacity={0.8}
            >
              <Icon name="create-outline" size={22} color={colors.primary.main} />
              <Text style={styles.primaryActionText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShare}
              style={styles.primaryActionButton}
              activeOpacity={0.8}
            >
              <Icon name="share-outline" size={22} color={colors.primary.main} />
              <Text style={styles.primaryActionText}>Share</Text>
            </TouchableOpacity>

            {moment.imageUri && (
              <TouchableOpacity
                onPress={handleSavePhoto}
                style={styles.primaryActionButton}
                disabled={isSavingPhoto}
                activeOpacity={0.8}
              >
                {isSavingPhoto ? (
                  <Icon name="hourglass-outline" size={22} color={colors.text.tertiary} />
                ) : (
                  <Icon name="download-outline" size={22} color={colors.primary.main} />
                )}
                <Text style={[styles.primaryActionText, isSavingPhoto && styles.actionTextDisabled]}>
                  {isSavingPhoto ? "Saving..." : "Save"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.dangerActions}>
            <TouchableOpacity
              onPress={handleDelete}
              style={styles.dangerActionButton}
              activeOpacity={0.8}
            >
              <Icon name="trash-outline" size={22} color={colors.state.error} />
              <Text style={styles.dangerActionText}>Delete Moment</Text>
            </TouchableOpacity>
          </View>
        </View>
        </ScrollView>
      </Screen>

      {/* --- Fullscreen Image Modal --- */}
      {moment.imageUri && (
        <Modal
          visible={isFullscreenVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsFullscreenVisible(false)}
        >
          <Pressable
            style={styles.modalContainer}
            onPress={() => setIsFullscreenVisible(false)}
          >
            <View style={styles.modalBackdrop} />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setIsFullscreenVisible(false)}
              activeOpacity={0.7}
            >
              <Icon name="close" size={32} color={colors.text.white} />
            </TouchableOpacity>
            <View style={styles.modalImageWrapper}>
              <ScrollView
                contentContainerStyle={styles.modalContent}
                maximumZoomScale={3}
                minimumZoomScale={1}
                bouncesZoom
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
              >
                <Image source={{ uri: moment.imageUri }} style={styles.modalImage} resizeMode="contain" />
              </ScrollView>
            </View>
          </Pressable>
        </Modal>
      )}
    </>
  );
}

// ============================================================================
// STYLES
// ============================================================================
const styles = StyleSheet.create({
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
  },
  notFoundText: {
    fontSize: typography.size.md,
    color: colors.text.secondary,
  },

  // Combined Header and Image Container
  headerImageContainer: {
    backgroundColor: colors.background.card,
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.lg, // Normal spacing
    marginTop: spacing.xl, // Add top margin to account for native header
    ...shadows.medium,
    position: "relative", // For absolute positioning of image
    minHeight: 80 + IMAGE_SIZE, // Ensure container is tall enough for header + image
  },
  headerContent: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    lineHeight: typography.size.xl * typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tight,
  },
  titlePlaceholder: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.medium,
    color: colors.text.tertiary,
    lineHeight: typography.size.xl * typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tight,
    fontStyle: "italic",
  },
  dateAndFavoriteRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.xs,
  },
  fullDateTime: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    fontWeight: typography.weight.medium,
  },
  favoriteButton: {
    padding: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.background.white,
    ...shadows.small,
  },

  // Enhanced Image Section
  imageSection: {
    alignItems: "center",
    height: IMAGE_SIZE, // Ensure container has height for absolute positioned image
  },
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    overflow: "hidden",
    backgroundColor: colors.background.card,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: spacing.sm,
  },
  noImageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.card,
    borderWidth: 2,
    borderColor: colors.border.medium,
    borderStyle: "dashed",
    gap: spacing.lg,
  },
  noImageText: {
    fontSize: typography.size.lg,
    color: colors.text.tertiary,
    fontWeight: typography.weight.medium,
  },

  // Full Image Layout (extends to screen edges below header)
  fullImageContainer: {
    position: "absolute",
    left: -spacing.lg, // Extend beyond card padding to screen edge
    right: -spacing.lg, // Extend beyond card padding to screen edge
    top: 80, // Position below header content (approximate height)
    height: IMAGE_SIZE, // Same size as before
    borderBottomLeftRadius: 20, // Match card border radius at bottom
    borderBottomRightRadius: 20,
    overflow: "hidden",
  },
  fullImage: {
    width: "100%",
    height: "100%",
  },
  imageExpandIndicator: {
    position: "absolute",
    bottom: spacing.sm,
    right: spacing.sm,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: spacing.xs,
    borderRadius: 12,
  },

  // Combined Content Section
  contentSection: {
    marginBottom: spacing.lg,
  },
  contentCard: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
    ...shadows.medium,
  },
  moodSection: {
    marginBottom: spacing.sm,
  },
  moodHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  moodLabel: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    fontWeight: typography.weight.medium,
    textTransform: "uppercase",
    letterSpacing: typography.letterSpacing.wide,
  },
  moodTypeIndicator: {
    backgroundColor: colors.primary.muted,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 12,
  },
  moodTypeText: {
    fontSize: typography.size.xs,
    color: colors.primary.main,
    fontWeight: typography.weight.bold,
  },
  moodContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  moodEmoji: {
    fontSize: typography.size.xl,
    textAlign: "center",
    minWidth: typography.size.xl + 4,
    lineHeight: 24,
  },
  moodName: {
    fontSize: typography.size.xl,
    color: colors.text.primary,
    fontWeight: typography.weight.semibold,
  },
  notesSection: {
    // No margin needed since it's the last section
  },
  notesSectionWithMood: {
    marginTop: spacing.sm,
  },
  notesHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: 2,
  },
  notesTitle: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    fontWeight: typography.weight.medium,
    textTransform: "uppercase",
    letterSpacing: typography.letterSpacing.wide,
  },
  notesContent: {
    fontSize: typography.size.base,
    color: colors.text.primary,
    lineHeight: typography.size.base * typography.lineHeight.normal,
    fontWeight: typography.weight.regular,
  },
  noNotesContent: {
    fontSize: typography.size.base,
    color: colors.text.tertiary,
    lineHeight: typography.size.base * typography.lineHeight.normal,
    fontWeight: typography.weight.regular,
    fontStyle: "italic",
  },

  // Scroll View Styles
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },

  // Enhanced Actions Section
  actionsSection: {
    gap: spacing.md,
    marginTop: "auto", // Push to bottom if content is short
  },
  primaryActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    justifyContent: "center", // Center buttons on screen
    marginBottom: spacing.xxxl, // Gap before divider, same as divider to delete button gap
  },
  primaryActionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border.light,
    minWidth: 100,
    ...shadows.small,
  },
  primaryActionText: {
    fontSize: typography.size.base,
    color: colors.primary.main,
    fontWeight: typography.weight.semibold,
  },
  actionTextDisabled: {
    color: colors.text.tertiary,
  },
  dangerActions: {
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    paddingTop: spacing.xxxl,
  },
  dangerActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.state.error,
    ...shadows.small,
  },
  dangerActionText: {
    fontSize: typography.size.base,
    color: colors.state.error,
    fontWeight: typography.weight.semibold,
  },
  modalContainer: {
    flex: 1,
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
  },
  modalImageWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseButton: {
    position: "absolute",
    top: spacing.huge + spacing.lg,
    right: spacing.xl,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.large,
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minWidth: SCREEN_WIDTH,
    minHeight: SCREEN_HEIGHT,
  },
  modalImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
});