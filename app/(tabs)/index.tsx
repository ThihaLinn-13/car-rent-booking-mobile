import { getCars } from "@/api/car_api";
import { getCarBrands } from "@/api/car_brand";
import TopBar from "@/components/custom/ui/TopBar";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Image } from "@/components/ui/image";
import { Colors } from "@/constant/Color";
import { useBookingStore } from "@/store/booking-store";
import { useCarCateogryStore } from "@/store/use-car-category-store";
import { useCarState } from "@/store/user-car-store";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, Pressable, ScrollView, Text, useColorScheme, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

  const {
    carCategories, setCarCategories,
    isLoading: isLoadingForCarCategory, hasNext: hasNextForCarCategory, page: pageForCarCategory,
    setPage: setCarCategoryPage, setHasNext: setCarCategoryHasNext, setIsLoading: setCarCategoryIsLoading,
  } = useCarCateogryStore();

  const {
    cars, setCars,
    hasNext: hasNextForCar, page: pageForCar, isLoading: isLoadingForCar,
    setPage: setCarPage, setHasNext: setCarHasNext, setIsLoading: setCarIsLoading,
  } = useCarState();

  const { setSelectedCardId } = useBookingStore();
  const router = useRouter();

  const getCarBrand = async (size: number) => {
    if (isLoadingForCarCategory || !hasNextForCarCategory) return;
    setCarCategoryIsLoading(true);
    try {
      const response = await getCarBrands(pageForCarCategory, size);
      if (response?.data) {
        setCarCategories(pageForCarCategory === 0 ? response.data : [...carCategories, ...response.data]);
        setCarCategoryHasNext(response.hasNext);
        setCarCategoryPage(pageForCarCategory + 1);
      }
    } catch (error) {
      console.error('Failed to fetch car brands:', error);
    } finally {
      setCarCategoryIsLoading(false);
    }
  };

  const getCar = async (size: number) => {
    if (isLoadingForCar || !hasNextForCar) return;
    setCarIsLoading(true);
    try {
      const response = await getCars(pageForCar, size);
      if (response?.data) {
        setCars(pageForCar === 0 ? response.data : [...cars, ...response.data]);
        setCarHasNext(response.hasNext);
        setCarPage(pageForCar + 1);
      }
    } catch (error) {
      console.error('Failed to fetch cars:', error);
    } finally {
      setCarIsLoading(false);
    }
  };

  useEffect(() => {
    getCarBrand(5);
    getCar(5);
  }, []);

  const isDark = theme === "dark";

  return (
    <ScrollView
      className="flex-1 bg-slate-50 dark:bg-zinc-900"
      style={{ paddingTop: insets.top }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      {/* Top bar */}
      <TopBar />

      {/* Banner carousel */}
      <View className="mb-6">
        <Carousel
          loop
          autoPlay
          autoPlayInterval={3500}
          width={screenWidth}
          height={190}
          data={DATA}
          scrollAnimationDuration={800}
          onSnapToItem={(index) => setActiveSlide(index)}
          renderItem={({ item }) => (
            <View className="px-4">
              <View
                className="rounded-3xl overflow-hidden"
                style={{ height: 190, elevation: 6, shadowColor: '#1e40af', shadowOpacity: 0.25, shadowRadius: 12 }}
              >
                <Image source={item.img} alt="banner" className="w-full h-full" resizeMode="cover" />
                <View className="absolute inset-0" style={{ backgroundColor: 'rgba(15,23,42,0.2)' }} />
              </View>
            </View>
          )}
        />
        {/* Dot indicators */}
        <View className="flex-row justify-center mt-3" style={{ gap: 6 }}>
          {DATA.map((_, i) => (
            <View
              key={i}
              style={{
                width: i === activeSlide ? 22 : 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: i === activeSlide ? Colors[theme].tabActive : '#cbd5e1',
              }}
            />
          ))}
        </View>
      </View>

      {/* Brands */}
      <View className="mb-6 px-4">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-base font-bold text-slate-800 dark:text-white">Brand</Text>
          <Pressable onPress={() => router.push('/brands')}>
            <Text className="text-sm font-medium text-slate-800 dark:text-white">view all</Text>
          </Pressable>
        </View>
        <FlatList
          data={carCategories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.name}
          ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
          onEndReachedThreshold={0.2}
          onEndReached={() => { if (!isLoadingForCarCategory && hasNextForCarCategory) getCarBrand(5); }}
          renderItem={({ item }) => (
            <Pressable className="items-center" style={{ width: 64 }}>
              <View
                className="mb-2 rounded-2xl overflow-hidden items-center justify-center"
                style={{
                  width: 56, height: 56,
                  backgroundColor: isDark ? '#27272a' : '#f1f5f9',
                }}
              >
                <Avatar size="lg">
                  {item.imageUrl
                    ? <AvatarImage source={{ uri: item.imageUrl }} />
                    : <AvatarFallbackText className="text-white">{item.name}</AvatarFallbackText>
                  }
                </Avatar>
              </View>
              <Text numberOfLines={1} className="text-slate-600 dark:text-zinc-300 text-xs font-medium text-center">
                {item.name}
              </Text>
            </Pressable>
          )}
        />
      </View>

      {/* Vehicles */}
      <View className="pl-4">
        <View className="flex-row items-center justify-between mb-3 pr-4">
          <Text className="text-base font-bold text-slate-800 dark:text-white">Available Cars</Text>
          <Pressable onPress={() => router.push('/cars')}>
            <Text className="text-sm font-medium text-slate-800 dark:text-white">view all</Text>
          </Pressable>
        </View>
        <FlatList
          data={cars}
          horizontal
          showsHorizontalScrollIndicator={false}
          key="vehicles-horizontal"
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          contentContainerStyle={{ paddingRight: 32, paddingBottom: 4 }}
          onEndReachedThreshold={0.2}
          onEndReached={() => { if (!isLoadingForCar && hasNextForCar) getCar(4); }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                router.push(`/vehicle/${item.id}`);
                setSelectedCardId(item);
              }}
            >
              <View
                className="rounded-2xl overflow-hidden"
                style={{
                  width: screenWidth * 0.72,
                  backgroundColor: isDark ? '#27272a' : '#ffffff',
                  elevation: 3,
                  shadowColor: '#000',
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                }}
              >
                {/* Image */}
                <View style={{ height: 160, backgroundColor: isDark ? '#3f3f46' : '#f1f5f9' }}>
                  <Image source={item.imageUrl} alt={item.name} className="w-full h-full" resizeMode="cover" />
                  {/* Price badge */}
                  <View
                    className="absolute top-2 right-2 rounded-xl px-2 py-1"
                    style={{ backgroundColor: Colors[theme].tabActive }}
                  >
                    <Text className="text-white text-xs font-bold">${item.price}/d</Text>
                  </View>
                </View>
                {/* Info */}
                <View className="px-3 py-2.5">
                  <Text numberOfLines={1} className="text-slate-800 dark:text-white font-semibold text-sm mb-0.5">
                    {item.name}
                  </Text>
                  <Text className="text-slate-400 dark:text-zinc-400 text-[10px] font-mono">
                    {item.carNumber}
                  </Text>
                </View>
              </View>
            </Pressable>
          )}
        />
      </View>
    </ScrollView>
  );
}
