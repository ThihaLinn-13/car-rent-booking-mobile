import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { ChevronRightIcon, Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { Href, useRouter } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// Assuming you use Lucide icons (standard with gluestack)
import { Car, LucideIcon, Tag } from "lucide-react-native";

// 1. Define your list data
interface NavItem {
  name: string;
  link: Href;
  icon: LucideIcon;
}

const menuItems: NavItem[] = [
  { name: "Car Management", link: "/(tabs)/profile/management/car" , icon: Car },
  { name: "Brand Management", link: "/(tabs)/profile/management/brand", icon: Tag },
];

export default function Index() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <Box className="flex-1 bg-slate-50" style={{ paddingTop: insets.top + 20 }}>
      <Box className="px-4">
        <Text className="text-2xl font-bold mb-6 text-slate-800">Management</Text>
        
        <Box className="bg-white rounded-2xl overflow-hidden border border-slate-200">
          {menuItems.map((item, index) => (
            <Pressable
              key={item.name}
              onPress={() => router.navigate(item.link)}
              className={`p-4 active:bg-slate-100 ${
                index !== menuItems.length - 1 ? "border-b border-slate-100" : ""
              }`}
            >
              <HStack className="justify-between items-center">
                <HStack space="md" className="items-center">
                  <Icon as={item.icon} size="md" className="text-slate-600" />
                  <Text className="text-slate-700 font-medium">{item.name}</Text>
                </HStack>
                
                <Icon as={ChevronRightIcon} size="sm" className="text-slate-400" />
              </HStack>
            </Pressable>
          ))}
        </Box>
      </Box>
    </Box>
  );
}