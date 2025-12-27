// ============================================================================
// GALLERY SCREEN - Cozy Gallery View
// ============================================================================

import { chunkIntoRows, EmptyState, Icon, PhotoRow, Screen, ScreenHeader, Text } from "@/src/components";
import { Button } from "@/src/components/ui/Button";
import { getMoodByValue, MOODS, MoodValue } from "@/src/constants/moods";
import { colors, spacing, typography } from "@/src/constants/theme";
import { useMoments } from "@/src/contexts/MomentsContext";
import { groupMomentsByMonth } from "@/src/utils";
import { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, SectionList, StyleSheet, TextInput, View } from "react-native";

// ============================================================================
// COMPONENTS
// ============================================================================

function MoodFilter({ selectedMood, onSelect }: { selectedMood: MoodValue | null; onSelect: (mood: MoodValue) => void; }) {
  return (
    <View style={styles.moodFilterContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.moodFilterScroll}>
        {MOODS.map((mood) => {
          const isSelected = selectedMood === mood.value;
          return (
            <Pressable
              key={mood.value}
              onPress={() => onSelect(mood.value)}
              style={isSelected ? [styles.moodOption, styles.moodOptionActive] : styles.moodOption}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text style={styles.moodLabel}>{mood.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

function SearchBar({ searchQuery, onSearchChange }: { searchQuery: string; onSearchChange: (query: string) => void; }) {
  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchIcon}>
        <Icon name="search" size={18} color={colors.text.tertiary} />
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search moments..."
        placeholderTextColor={colors.text.tertiary}
        value={searchQuery}
        onChangeText={onSearchChange}
      />

      {searchQuery.length > 0 && (
        <Pressable onPress={() => onSearchChange("")} style={styles.clearButton}>
          <Icon name="close-circle" size={20} color={colors.text.tertiary} />
        </Pressable>
      )}
    </View>
  );
}

function FavoritesFilterButton({ isActive, onToggle }: { isActive: boolean; onToggle: () => void }) {
  return (
    <Button
      variant="secondary"
      icon={isActive ? "heart" : "heart-outline"}
      iconOnly
      onPress={onToggle}
      style={isActive ? [styles.filterButton, styles.filterButtonActive] : styles.filterButton}
    />
  );
}

function MoodFilterButton({ selectedMood, onPress }: { selectedMood: MoodValue | null; onPress: () => void; }) {
  if (selectedMood) {
    const mood = getMoodByValue(selectedMood);
    return (
      <Button
        variant="secondary"
        text={mood?.emoji || selectedMood}
        onPress={onPress}
        style={[styles.filterButton, styles.filterButtonActive]}
      />
    );
  }
  
  return (
    <Button
      variant="secondary"
      text="😶"
      onPress={onPress}
      style={styles.filterButton}
    />
  );
}

function FilterBar({ searchQuery, onSearchChange, showFavoritesOnly, onToggleFavorites, selectedMood,onMoodButtonPress}: {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
  selectedMood: MoodValue | null;
  onMoodButtonPress: () => void;
}) {
  return (
    <View style={styles.filterBar}>
      <SearchBar searchQuery={searchQuery} onSearchChange={onSearchChange} />
      <FavoritesFilterButton isActive={showFavoritesOnly} onToggle={onToggleFavorites} />
      <MoodFilterButton selectedMood={selectedMood} onPress={onMoodButtonPress} />
    </View>
  );
}

function MonthHeader({ month, count }: { month: string; count: number }) {
  return (
    <View style={styles.sectionHeader} collapsable={false}>
      <View style={styles.sectionHeaderContent}>
        <Text style={styles.sectionTitle}>{month}</Text>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      </View>
    </View>
  );
}

function GalleryGrid({ sections }: { sections: any[] }) {
  return (
    <SectionList
      sections={sections}
      keyExtractor={(_, index) => `row-${index}`}
      renderSectionHeader={({ section }) => <MonthHeader month={section.month} count={section.count} />}
      renderItem={({ item: rowMoments }) => <PhotoRow moments={rowMoments} showTitles />}
      stickySectionHeadersEnabled
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      style={styles.sectionList}
    />
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function GalleryScreen() {
  const { moments, isLoading } = useMoments();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodValue | null>(null);
  const [showMoodFilter, setShowMoodFilter] = useState(false);

  const filteredMoments = useMemo(() => {
    let filtered = moments;
    if (showFavoritesOnly) filtered = filtered.filter((m) => m.isFavorite);
    if (selectedMood) filtered = filtered.filter((m) => m.mood === selectedMood);
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) => m.title.toLowerCase().includes(query) || m.notes?.toLowerCase().includes(query) || m.mood?.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [moments, showFavoritesOnly, selectedMood, searchQuery]);

  const sections = useMemo(() => {
    const groups = groupMomentsByMonth(filteredMoments);
    return groups.map((group) => ({
      month: group.monthName,
      count: group.moments.length,
      data: chunkIntoRows(group.moments, 4),
    }));
  }, [filteredMoments]);

  const totalCount = moments.length;
  const filteredCount = filteredMoments.length;
  const hasActiveFilters = showFavoritesOnly || selectedMood !== null || searchQuery.trim().length > 0;
  const momentLabel = totalCount === 1 ? "moment" : "moments";

  const handleMoodSelect = (mood: MoodValue) => {
    setSelectedMood(mood);
    setShowMoodFilter(false);
  };
  const handleMoodButtonPress = () => {
    if (selectedMood) setSelectedMood(null);
    else setShowMoodFilter(!showMoodFilter);
  };

  if (isLoading) {
    return (
      <Screen edges={["top"]}>
        <ScreenHeader title="Your Gallery" subtitle="Loading..." />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen edges={["top"]}>
      <ScreenHeader
        title="Gallery"
        subtitle={
          hasActiveFilters
            ? `${filteredCount} of ${totalCount} ${momentLabel}`
            : totalCount === 0
            ? "Waiting for your first moment..."
            : `${totalCount} ${momentLabel} captured`
        }
      />

      {totalCount > 0 && (
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showFavoritesOnly={showFavoritesOnly}
          onToggleFavorites={() => {
            setShowFavoritesOnly(!showFavoritesOnly);
          }}
          selectedMood={selectedMood}
          onMoodButtonPress={handleMoodButtonPress}
        />
      )}

      {showMoodFilter && <MoodFilter selectedMood={selectedMood} onSelect={handleMoodSelect} />}

      {filteredMoments.length > 0 ? (
        <View style={styles.galleryContainer}>
          <GalleryGrid sections={sections} />
        </View>
      ) : totalCount === 0 ? (
        <EmptyState icon="images-outline" title="No memories yet" subtitle="Your captured moments will appear here" />
      ) : (
        <EmptyState icon="search-outline" title="No matches found" subtitle="Try adjusting your search or filters" />
      )}
    </Screen>
  );
}

// ============================================================================
// STYLES - Cozy Gallery
// ============================================================================

const styles = StyleSheet.create({
  // Filter Bar
  filterBar: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: colors.background.light,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    minHeight: 44,
  },
  searchIcon: { marginRight: spacing.xs, justifyContent: "center" },
  searchInput: { 
    flex: 1, 
    fontSize: typography.size.sm, 
    color: colors.text.primary, 
    padding: 0,
    paddingVertical: spacing.sm,
  },
  clearButton: { 
    marginLeft: spacing.xs, 
    padding: spacing.xs,
    justifyContent: "center",
    alignItems: "center",
  },

  filterButton: {
    width: 44,
    height: 44,
    minHeight: 44,
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderRadius: 12,
  },
  filterButtonActive: { 
    borderColor: colors.primary.main,
    borderWidth: 2,
  },

  // Mood Filter
  moodFilterContainer: {
    marginBottom: spacing.xl,
    marginHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  moodFilterScroll: { paddingHorizontal: 8, gap: 4 },
  moodOption: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    backgroundColor: colors.background.light,
    borderWidth: 1,
    borderColor: colors.border.light,
    marginRight: spacing.sm,
    minHeight: 32,
    flexShrink: 0,
  },
  moodOptionActive: { 
    backgroundColor: colors.background.light,
    borderColor: colors.primary.main,
    borderWidth: 2,
  },
  moodEmoji: {
    fontSize: 18,
    lineHeight: 20,
    marginBottom: 2,
  },
  moodLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    textAlign: "center",
  },

  // Section Headers
  sectionHeader: {
    backgroundColor: colors.background.main,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  sectionHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  sectionTitle: { 
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 0,
  },
  badgeContainer: {
    backgroundColor: colors.background.light,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    minWidth: 32,
    alignItems: "center",
  },
  badgeText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xxxl,
  },
  galleryContainer: { 
    flex: 1,
    paddingTop: spacing.xs,
  },
  sectionList: { flex: 1 },
  listContent: { 
    paddingBottom: spacing.xs,
    paddingTop: spacing.xs,
  },
});
