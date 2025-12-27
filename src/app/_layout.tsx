import { MomentsProvider } from "@/src/contexts/MomentsContext";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <MomentsProvider>
        <Stack
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="camera"
            options={{
              title: "Camera",
              headerShown: true
            }}
          />
          <Stack.Screen
            name="moment/[id]"
            options={{
              title: "Your Moment",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="add"
            options={{
              title: "Add Moment",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="edit/[id]"
            options={{
              title: "Edit Moment",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="achievements"
            options={{
              title: "Achievements",
              headerShown: true,
            }}
          />
        </Stack>
      </MomentsProvider>
    </SafeAreaProvider>
  );
}
