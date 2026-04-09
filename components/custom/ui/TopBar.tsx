import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/store/use-auth-store';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
// Import useColorMode if you need to pass raw color values to icons
import { useColorMode } from '@gluestack-style/react';

export default function TopBar() {
  const { user } = useAuth();
  const colorMode = useColorMode();

  // Determine icon color based on active mode
  const iconColor = colorMode === 'dark' ? '#f4f4f5' : '#18181b';

  return (
    <HStack 
      className='p-4 justify-between items-center '
    >
      <HStack className='items-center' space='md'>
        <Avatar size="lg" className='rounded-full '>
          <AvatarFallbackText className='text-zinc-900 dark:text-zinc-100'>
            {user?.name}
          </AvatarFallbackText>
          <AvatarImage
            source={{ uri: user?.img_url }}
            className='rounded-full'
          />
        </Avatar>
        
        <Box>
          <Text className='font-bold text-lg text-zinc-900 dark:text-zinc-100'>
            Good morning
          </Text>
          <Text className='font-normal text-md text-zinc-500 dark:text-zinc-400'>
            {user?.name}
          </Text>
        </Box>
      </HStack>

      <Ionicons name="mail-outline" size={28} color={iconColor} />
    </HStack>
  );
}