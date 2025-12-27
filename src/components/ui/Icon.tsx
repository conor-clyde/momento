// src/components/ui/Icon.tsx
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants/theme";

export type IconName = keyof typeof Ionicons.glyphMap;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

export function Icon({ 
  name, 
  size = 24, 
  color = colors.text.primary 
}: IconProps) {
  return <Ionicons name={name} size={size} color={color} />;
}
