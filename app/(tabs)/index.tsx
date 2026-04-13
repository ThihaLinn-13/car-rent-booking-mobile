import TopBar from "@/components/custom/ui/TopBar";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Image } from "@/components/ui/image";
import { Colors } from "@/constant/Color";
import { useBookingStore } from "@/store/booking-store";
import { useCarCateogryStore } from "@/store/use-car-category-store";
import { useCarState } from "@/store/use-car-store";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, Pressable, RefreshControl, ScrollView, Text, useColorScheme } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SkeletonBox } from "@/components/custom/ui/Skeleton";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { useSharedValue } from 'react-native-reanimated';


const screenWidth = Dimensions.get("window").width;

const DATA = [
  { id: 1, img: require("@/assets/banner/car_banner_image_1.jpg") },
  { id: 2, img: require("@/assets/banner/car_banner_image_2.jpg") },
  { id: 3, img: require("@/assets/banner/car_banner_image_3.jpg") },
  { id: 4, img: require("@/assets/banner/car_banner_image_4.jpg") },
  { id: 5, img: require("@/assets/banner/banner_1.jpg") },
];

export default function Home() {
  const insets = useSafeAreaInsets();
  const [activeSlide, setActiveSlide] = useState(0);
  const theme = useColorScheme() ?? "light";
  const progress = useSharedValue(0);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    useCarCateogryStore.setState({ page: 0, hasNext: true, carCategories: [] });
    useCarState.setState({ page: 0, hasNext: true, cars: [] });
    await Promise.all([getCarBrands(), getCars()]);
    setRefreshing(false);
  };


  const {
    carCategories, setCarCategories, getCarBrands,
    isLoading: isLoadingForCarCategory, hasNext: hasNextForCarCategory, page: pageForCarCategory,
    setPage: setCarCategoryPage, setHasNext: setCarCategoryHasNext, setIsLoading: setCarCategoryIsLoading,
  } = useCarCateogryStore();

  const {
    cars, setCars, getCars,
    hasNext: hasNextForCar, page: pageForCar, isLoading: isLoadingForCar,
    setPage: setCarPage, setHasNext: setCarHasNext, setIsLoading: setCarIsLoading,
  } = useCarState();

  const { setSelectedCar } = useBookingStore();
  const router = useRouter();

  const getCarBrand = async () => {
    getCarBrands();
  };

  const getCar = async () => {
    getCars();
  };

  useEffect(() => {
    getCarBrands();
    getCars();
  }, []);

  const isDark = theme === "dark";

  return (
    <ScrollView
      className="flex-1 bg-slate-50 dark:bg-zinc-900"
      style={{ paddingTop: insets.top }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 50 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors[theme].tabActive}
          colors={[Colors[theme].tabActive]}
        />
      }
    >
      {/* Top bar */}
      <TopBar />

      <Box className="mb-6">
        <Box style={{ position: 'relative' }}>
          <Carousel
            loop
            autoPlay
            autoPlayInterval={3500}
            width={screenWidth}
            height={150}
            data={DATA}

            scrollAnimationDuration={800}
            onProgressChange={(_, absoluteProgress) => {
              progress.value = absoluteProgress;
            }}
            onSnapToItem={(index) => setActiveSlide(index)}
            renderItem={({ item }) => (
              <Box className="px-4">
                <Box
                  className="rounded-3xl overflow-hidden"
                  style={{ height: 150, elevation: 6, shadowColor: '#1e40af', shadowOpacity: 0.25, shadowRadius: 12 }}
                >
                  <Image source={item.img} alt="banner" className="w-full h-full" resizeMode="cover" />
                  <Box className="absolute inset-0" style={{ backgroundColor: 'rgba(15,23,42,0.2)' }} />
                </Box>
              </Box>
            )}
          />

          {/* Dots overlaid inside */}
          <HStack
            style={{
              position: 'absolute',
              bottom: 12,
              left: 0,
              right: 0,
              justifyContent: 'center',
              gap: 6,
            }}
          >
            {DATA.map((_, i) => (
              <Box
                key={i}
                style={{
                  width: i === activeSlide ? 22 : 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor:
                    i === activeSlide ? Colors[theme].tabActive : '#cbd5e1',
                }}
              />
            ))}
          </HStack>
        </Box>
      </Box>

      {/* Brands */}
      <VStack className="mb-6 px-4" space="sm">
        <HStack className="items-center justify-between">
          <Text className="text-base font-bold text-slate-800 dark:text-white">Brands</Text>
          <Pressable onPress={() => router.push('/brands')}>
            <Text className="text-sm font-medium text-blue-600 dark:text-blue-400">view all</Text>
          </Pressable>
        </HStack>

        <FlatList
          data={isLoadingForCarCategory && carCategories.length === 0 ? Array(5).fill(null) : carCategories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => item?.name ?? `skeleton-brand-${index}`}
          ItemSeparatorComponent={() => <Box className="w-4" />}
          onEndReachedThreshold={0.2}
          onEndReached={() => { if (!isLoadingForCarCategory && hasNextForCarCategory) getCarBrands(); }}
          renderItem={({ item }) =>
            !item ? (
              <VStack className="items-center w-16" space="xs">
                <SkeletonBox width={44} height={44} borderRadius={22} />
                <SkeletonBox width={36} height={8} borderRadius={4} />
              </VStack>
            ) : (
              <Pressable>
                <VStack className="items-center w-16" space="xs">
                  <Avatar size="md">
                    {item.imageUrl
                      ? <AvatarImage source={{ uri: item.imageUrl }} />
                      : <AvatarFallbackText className="text-white">{item.name}</AvatarFallbackText>
                    }
                  </Avatar>
                  <Text numberOfLines={1} className="text-[10px] text-slate-500 dark:text-zinc-400 text-center">
                    {item.name}
                  </Text>
                </VStack>
              </Pressable>
            )
          }
        />
      </VStack>

      {/* Vehicles */}
      <VStack className="px-4" space="sm">
        <HStack className="items-center justify-between">
          <Text className="text-base font-bold text-slate-800 dark:text-white">Available Cars</Text>
          <Pressable onPress={() => router.push('/cars')}>
            <Text className="text-sm font-medium text-blue-600 dark:text-blue-400">view all</Text>
          </Pressable>
        </HStack>

        <HStack className="flex-wrap" space="sm">
          {(isLoadingForCar && cars.length === 0 ? Array(4).fill(null) : cars).map((item, index) => (
            <Box key={item?.id ?? `skeleton-car-${index}`} className="w-[48%]">
              {!item ? (
                <VStack className="rounded-2xl overflow-hidden bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700">
                  <SkeletonBox width="100%" height={100} borderRadius={0} />
                  <VStack className="p-2.5" space="xs">
                    <SkeletonBox width="75%" height={10} borderRadius={4} />
                    <SkeletonBox width="45%" height={8} borderRadius={4} />
                  </VStack>
                </VStack>
              ) : (
                <Pressable onPress={() => { router.push(`/vehicle/${item.id}`); setSelectedCar(item); }}>
                  <VStack className="rounded-2xl overflow-hidden bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700">
                    <Box className="h-24 bg-green-50 dark:bg-zinc-700">
                      <Image
                        source={{ uri: item.imageUrl }}
                        alt={item.name}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    </Box>
                    <VStack className="p-2.5" space="xs">
                      <Text numberOfLines={1} className="text-xs font-semibold text-slate-800 dark:text-white">
                        {item.name}
                      </Text>
                      <Text className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                        {item.carNumber}
                      </Text>
                      <Text className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                        ${item.price}<Text className="text-[9px] text-slate-400 dark:text-zinc-500 font-normal">/day</Text>
                      </Text>
                    </VStack>
                  </VStack>
                </Pressable>
              )}
            </Box>
          ))}
        </HStack>
      </VStack>
    </ScrollView>
  );
}
