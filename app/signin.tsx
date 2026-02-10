import { GoogleIcon } from "@/components/custom/icons/GoogleIcon";
import { Box } from "@/components/ui/box";
import { Divider } from "@/components/ui/divider";
import {
  Text
} from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { webClientId } from "@/config/config";
import { saveUser } from "@/lib/secureStore";
import { superbase } from "@/lib/superbase";
import { useAuth } from "@/store/use-auth-store";
import AntDesign from '@expo/vector-icons/AntDesign';
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from 'expo-apple-authentication';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Pressable } from "react-native";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useAuth();

  const router = useRouter();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        webClientId,
      offlineAccess: true,
    });
  }, []);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
      const userInfo = await GoogleSignin.signIn();

      if (userInfo.data?.idToken) {
        const { data, error } = await superbase.auth.signInWithIdToken({
          provider: "google",
          token: userInfo.data.idToken,
        });

        if (error) throw error;

        await saveUser(data.user);

        setUser(data.user as any);
        router.replace('/(tabs)');

      }
    } catch (error: any) {
      if (error.code !== statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert("Login Error", error.message);
        console.log("Google Sign-In Error:", error.message);
        console.log("Error Code:", error.code);
        console.log("Error Details:", error.details);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithApple = async () => {
    setIsLoading(true);
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential.identityToken) {
        const { data, error } = await superbase.auth.signInWithIdToken({
          provider: 'apple',
          token: credential.identityToken,
        });

        if (error) throw error;

        await saveUser(data.user);
        setUser(data.user as any);
        router.replace('/(tabs)');
      }
    } catch (e: any) {
      if (e.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert("Apple Login Error", e.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack space="sm" className="flex-1 justify-end p-10 bg-slate-100">
      <Pressable
        onPress={signInWithGoogle}
        disabled={isLoading}
        className="border border-gray-200 rounded-3xl h-16 bg-white shadow-md overflow-hidden flex justify-around items-center flex-row px-10"
      >

        <Box className="w-6 h-6  ">
          <GoogleIcon />
        </Box>
        <Text className="text-gray-800 font-semibold text-lg">
          Continue with Google
        </Text>
      </Pressable>

      <Box className="px-2">
        <Divider className=" bg-gray-200 px-5" />
      </Box>
      <Pressable
        onPress={signInWithApple}
        disabled={isLoading}
        className="border border-gray-200 rounded-3xl h-16 bg-black shadow-md overflow-hidden flex justify-around items-center flex-row px-10"
      >
        <Box className="w-6 h-6 ">
          <AntDesign name="apple" size={21} color="white" />
        </Box>
        <Text className="text-white font-semibold text-lg">Continue with Apple</Text>
      </Pressable>
    </VStack>
  );
}


