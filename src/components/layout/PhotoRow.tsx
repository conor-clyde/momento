// ============================================================================
// PHOTO ROW - Single row of photos with consistent sizing
// Used by: Gallery, RecentMoments, and any photo grid
// ============================================================================

import { Dimensions, StyleSheet, View } from "react-native";
import { colors, spacing } from "../../constants/theme";
import { Moment } from "../../types";
import { Text } from "../ui/Text";
import { PhotoCard } from "./PhotoCard";

interface PhotoRowProps {
  moments: Moment[];
  showTitles?: boolean;
}

const COLUMNS = 4;
const GAP = 8;
const CONTAINER_PADDING = 16;
const MAX_TITLE_LENGTH = 20;

function truncateTitle(title: string): string {
  if (!title || title.length <= MAX_TITLE_LENGTH) return title;
  return title.substring(0, MAX_TITLE_LENGTH - 3) + "...";
}

export function PhotoRow({ moments, showTitles = false }: PhotoRowProps) {
  const screenWidth = Dimensions.get("window").width;
  // Account for parent container padding (spacing.lg = 16px on each side)
  const availableWidth = screenWidth - (CONTAINER_PADDING * 2);
  const photoSize = (availableWidth - (GAP * (COLUMNS - 1))) / COLUMNS;

  return (
    <View style={[styles.row, { marginBottom: showTitles ? spacing.md : GAP }]}>
      {moments.map((moment, index) => (
        <View 
          key={moment.id} 
          style={{ 
            width: photoSize, 
            marginRight: index < moments.length - 1 ? GAP : 0,
          }}
        >
          <View style={{ width: photoSize, height: photoSize, marginBottom: showTitles ? spacing.xs : 0 }}>
            <PhotoCard moment={moment} />
          </View>
          {showTitles && (
            <Text style={styles.title} numberOfLines={1}>
              {truncateTitle(moment.title)}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}
// Helper: Chunk array into rows
export const chunkIntoRows = <T,>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "nowrap",
    width: "100%",
  },
  title: {
    fontSize: 10,
    color: colors.text.secondary,
    fontWeight: "medium",
    textAlign: "center",
    paddingHorizontal: 2,
    marginTop: 2,
    lineHeight: 12,
    includeFontPadding: false,
  },
});
