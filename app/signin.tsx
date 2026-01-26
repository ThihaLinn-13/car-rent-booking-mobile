import { Box } from '@/components/ui/box';
import { Colors } from "@/constant/Color";
import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Signin() {



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.signinPage.bgColor }}
    >
      <Box className={`flex-1`}>
        <Text>sIGN IN</Text>
      </Box>
    </SafeAreaView>
  )
}