import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import "@/global.css";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  const theme = useColorScheme() ?? "light";
  return (
    <>
      <StatusBar style={theme === 'light' ? 'dark' : 'light'}></StatusBar>
      <Stack>
        <Stack.Protected guard={true}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={false}>
          <Stack.Screen name="signin" options={{ headerShown: false }} />

        </Stack.Protected>

      </Stack>
    </>
  );
}
