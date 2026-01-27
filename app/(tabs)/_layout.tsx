import { Colors } from "@/constant/Color";
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { Tabs } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";

export default function TabLayout() {
  const theme = useColorScheme() ?? "light";

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        tabBarActiveTintColor: Colors[theme].tabActive,
        tabBarInactiveTintColor: Colors[theme].tabInactive,
        tabBarStyle: {
          backgroundColor: Colors[theme].tabBg,
           borderTopWidth: 0, 
            elevation: 8,  
            
        },

        
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={24} name="home" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          headerShown: false,

          tabBarIcon: ({ color }) => (
            <FontAwesome size={24} name="map-marker" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="activity"
        options={{
          title: "Activity",
          headerShown: false,

          tabBarIcon: ({ color }) => (
            <FontAwesome size={24} name="tasks" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,

          tabBarIcon: ({ color }) => (
            <Entypo name="user" size={24} color={color} />),
        }}
      />
    </Tabs>
  );
}
