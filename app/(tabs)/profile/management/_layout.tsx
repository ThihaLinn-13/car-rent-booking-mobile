import { Stack } from 'expo-router'
import React from 'react'

export default function _layout() {
  return (
    <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="car" options={{ headerShown: false }} />
        <Stack.Screen name="brand" options={{ headerShown: false }} />
    </Stack>
  )
}