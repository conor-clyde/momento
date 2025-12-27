// ============================================================================
// SCREEN 
// ============================================================================

import { ReactNode } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView, SafeAreaViewProps, useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../constants/theme";

interface ScreenProps extends SafeAreaViewProps {
  children: ReactNode;
  scrollable?: boolean;
}

export function Screen({ children, scrollable = false, edges, style }: ScreenProps) {
  const insets = useSafeAreaInsets();
  
  if (scrollable) {
    // Default edges to include bottom if not specified, to handle Android navigation
    const defaultEdges = edges || ["top", "bottom"];
    
    return (
      <SafeAreaView style={[styles.container, style]} edges={defaultEdges}>
        <ScrollView 
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 16) }
          ]} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, style]} edges={edges}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
    paddingHorizontal: 16,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
