import "@/global.css";
import { useAuth } from "@/hooks/use-auth-store";
import { getData } from "@/lib/secureStore";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { useColorScheme } from "react-native";


export default function RootLayout() {
  const theme = useColorScheme() ?? "light";

  const {user,setUser} = useAuth();

  async function loadUser() {
    const savedUser = await getData("userData")
    if (savedUser) {
      const userDataWithJsonFormat = JSON.parse(savedUser)
      setUser(userDataWithJsonFormat);
    }
  }

  useEffect(() => {

    loadUser();
  });


  return (
    <>
      <StatusBar style={theme === 'light' ? 'dark' : 'light'}></StatusBar>

      <Stack>
        <Stack.Protected guard={user ? false : true}>
          <Stack.Screen name="signin" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={user ? true : false}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    </>
  );
}
