// src/components/ui/Text.tsx
import { Text as RNText, StyleSheet, TextProps } from "react-native";
import { colors, typography } from "../../constants/theme";

interface CustomTextProps extends TextProps {
  children?: React.ReactNode;
}

const styles = StyleSheet.create({
  text: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.regular,
    color: colors.text.primary,
    lineHeight: typography.size.base * typography.lineHeight.normal,
  },
});

export function Text({
  style,
  children,
  ...props
}: CustomTextProps) {
  return (
    <RNText style={[styles.text, style]} {...props}>
      {children}
    </RNText>
  );
}
