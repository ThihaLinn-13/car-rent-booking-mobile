import "dotenv/config";

export default {
  expo: {
    name: "car-rent-booking-mobile",
    slug: "car-rent-booking-mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "carrentbookingmobile",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      newArchEnabled: true,
      usesAppleSignIn: true,
      bundleIdentifier: "com.thihalinn.carrentbookingmobile",
      config: {
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAP_IOS_API_KEY,
      },
    },
    android: {
      newArchEnabled: true,
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
      },
      package: "com.thihalinn.carrentbookingmobile",
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAP_ANDROID_API_KEY,
        },
      },
    },
    plugins: [
      ["expo-secure-store", { configureAndroidBackup: true }],
      "expo-router",
      ["expo-splash-screen", { image: "./assets/images/splash-icon.png" }],
      "expo-sqlite",
      "expo-apple-authentication",
    ],
    extra: {
      eas: {
        projectId: "9904a352-d0a1-48e4-a302-5dc5ecfe4460",
      },
    },
  },
};
