import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAuth } from "@/store/use-auth-store";
import React from "react";

export default function Profile() {

  const { user, logout } = useAuth()


  return (
    <Box className="flex-1 bg-white">
      <Box
        className="h-40 w-full  bg-gray-400 flex justify-center items-center "

      >
       
        <Avatar size="xl" className=" overflow-hidden translate-y-3/4 ">
          <AvatarFallbackText>{user?.user_metadata.full_name}</AvatarFallbackText>
          <AvatarImage
            source={{ uri: user?.user_metadata.picture }}
          />
        </Avatar>
      </Box>

      <VStack space="xl" className="items-center mt-14 px-10">

        <VStack space="sm" className="items-center">
          <Text className="text-2xl font-semibold text-gray-800">
            {user?.user_metadata.full_name}
          </Text>
          <Text className="text-gray-500 font-medium">
            {user?.user_metadata.email}
          </Text>
        </VStack>

        <Button
          onPress={logout}
          size="lg"
          className="bg-red-500 hover:bg-red-600 active:bg-red-700 rounded-2xl w-full  shadow-md"
        >
          <ButtonText className="text-white font-semibold">Logout</ButtonText>
        </Button>

      </VStack>
    </Box>
  );
}
