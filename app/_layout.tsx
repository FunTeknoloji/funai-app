import { Stack } from "expo-router";
import { HeroUINativeProvider } from "heroui-native";
import { useColorScheme } from "react-native";
import { ChatProvider } from "../context/ChatContext";
import { SettingsProvider } from "../context/SettingsContext";
import "../styles/global.css";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SettingsProvider>
      <ChatProvider>
        <HeroUINativeProvider colorScheme={colorScheme ?? "dark"}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
        </HeroUINativeProvider>
      </ChatProvider>
    </SettingsProvider>
  );
}
