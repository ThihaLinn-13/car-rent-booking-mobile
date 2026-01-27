import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function Profile() {

    const insets = useSafeAreaInsets();
  

  return (
    <Box className=" flex-1" style={{paddingTop:insets.top}}>
        <Center className=" flex-1">
          <Text>Profile Page</Text>
        </Center>
      </Box>
  );
}
