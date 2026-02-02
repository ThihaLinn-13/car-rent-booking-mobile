import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { supabase } from '@/lib/superbase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { useEffect } from 'react';
export default function SignIn() {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '89266728671-a31o1op9rc7nle7q08hac815kuqmq1m7.apps.googleusercontent.com', 
    });
  }, []);

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      if (userInfo.data?.idToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: userInfo.data.idToken,
        });
        
        if (error) throw error;
        console.log("Logged in! Profile created via SQL Trigger.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box className="flex-1 justify-center p-4">
      <Button onPress={signInWithGoogle}>
        <ButtonText>Continue with Google</ButtonText>
      </Button>
    </Box>
  );
}