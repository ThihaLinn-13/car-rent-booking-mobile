import { Colors } from "@/constant/Color";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
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
            <FontAwesome size={24} name="user-circle-o" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
