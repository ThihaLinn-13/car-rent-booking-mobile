import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useAuth } from '@/store/use-auth-store';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useColorMode } from '@gluestack-style/react';
import React from 'react';
import { Pressable } from 'react-native';

export default function TopBar() {
  const { user } = useAuth();
  const colorMode = useColorMode();
  const isDark = colorMode === 'dark';

  return (
    <HStack className="px-5 pt-3 pb-4 justify-between items-center">
      <HStack className="items-center" space="sm">
        <Avatar size="md" className="rounded-full">
          <AvatarFallbackText className="text-white text-sm font-semibold">
            {user?.name}
          </AvatarFallbackText>
          <AvatarImage source={{ uri: user?.img_url }} className="rounded-full" />
        </Avatar>

        <VStack space="xs">
          <Text className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
            Welcome back 👋
          </Text>
          <Text className="text-base font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
            {user?.name ?? 'Guest'}
          </Text>
        </VStack>
      </HStack>

      <Pressable
        className="w-10 h-10 rounded-full items-center justify-center bg-slate-100 dark:bg-zinc-800"
      >
        <Ionicons
          name="notifications-outline"
          size={20}
          color={isDark ? '#a1a1aa' : '#52525b'}
        />
      </Pressable>
    </HStack>
  );
}