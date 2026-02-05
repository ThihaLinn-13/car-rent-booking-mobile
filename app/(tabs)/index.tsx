import { Box } from "@/components/ui/box";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/hooks/use-auth-store";
import React from "react";
import { Dimensions } from "react-native";
import Carousel from 'react-native-reanimated-carousel';
import { useSafeAreaInsets } from "react-native-safe-area-context";

const screenWidth = Dimensions.get('window').width;

const DATA = [
  { id: 1, img: 'https://picsum.photos/id/10/800/400' },
  { id: 2, img: 'https://picsum.photos/id/20/800/400' },
  { id: 3, img: 'https://picsum.photos/id/30/800/400' },
];

export default function Index() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  // Greeting Logic
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { label: "Good Morning", color: "text-orange-500", emoji: "☀️" };
    if (hour < 18) return { label: "Good Afternoon", color: "text-blue-500", emoji: "🌤️" };
    if (hour < 22) return { label: "Good Evening", color: "text-indigo-600", emoji: "🌙" };
    return { label: "Good Night", color: "text-purple-700", emoji: "😴" };
  };

  const greeting = getGreeting();

  return (
    <Box className="flex-1 items-center bg-white" style={{ paddingTop: insets.top }}>
      
      <Box className="w-full px-5 py-4 items-start">
        <Text className={`${greeting.color} text-2xl font-bold`}>
          {greeting.label}, {user?.user_metadata.name || 'Guest'} {greeting.emoji}
        </Text>
      </Box>

      <Box className="h-1/4 w-full bg-slate-400">
        <Carousel
          loop
          autoPlay={true}
          autoPlayInterval={3000}
          width={screenWidth}
          data={DATA}
          scrollAnimationDuration={1000}
          mode="vertical-stack"
          modeConfig={{
            stackInterval: 18,
            scaleInterval: 0.08,
            showLength: 3,
          }}
          renderItem={({ item }) => (
            <Box className="flex-1 items-center">
              <Image
                source={{ uri: item.img }}
                alt="carousel"
                className="w-full h-full"
              />
            </Box>
          )}
        />
      </Box>

      <Box></Box>
    </Box>
  );
}