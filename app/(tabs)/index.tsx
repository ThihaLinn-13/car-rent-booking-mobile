import { getCarCategories } from "@/api/car_category_api";
import { getCarModels } from "@/api/car_model_api";
import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useCarCateogryStore } from "@/store/use-car-category-store";
import { useCarState } from "@/store/user-car-store";
import { FlashList } from "@shopify/flash-list";
import React, { useEffect } from "react";
import { Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;

const DATA = [
  { id: 1, img: require("@/assets/banner/car_banner_image_1.jpg") },
  { id: 2, img: require("@/assets/banner/car_banner_image_2.jpg") },
  { id: 3, img: require("@/assets/banner/car_banner_image_3.jpg") },
  { id: 4, img: require("@/assets/banner/car_banner_image_4.jpg") },
];

export default function Index() {
  const insets = useSafeAreaInsets();
  const { carCategories, setCarCategories,
    isLoading: isLoadingForCarCategory, hasNext: hasNextForCarCategory, page: pageForCarCategory,
    setPage: setCarCategoryPage, setHasNext: setCarCategoryHasNext, setIsLoading: setCarCategoryIsLoading } = useCarCateogryStore();
  const { cars, setCars,
    hasNext: hasNextForCar, page: pageForCar, isLoading: isLoadingForCar,
    setPage: setCarPage, setHasNext: setCarHasNext, setIsLoading: setCarIsLoading
  } = useCarState();

  const getCarBrand = async (size: number) => {
    if (isLoadingForCarCategory) return;

    setCarCategoryIsLoading(true);
    const response = await getCarCategories(pageForCarCategory, size);

    if (response && response.data) {
      if (pageForCarCategory === 0) {
        setCarCategories(response.data);
      } else {
        setCarCategories([...carCategories, ...response.data]);
      }

      setCarCategoryHasNext(response.hasNext);
      setCarCategoryPage(pageForCarCategory + 1);
    }
    setCarCategoryIsLoading(false);
  };

  const getCars = async (size: number) => {
    if (isLoadingForCar) return;

    setCarIsLoading(true);

    const response = await getCarModels(pageForCar, size);

    if (response && response.data) {
      if (pageForCar === 0) {
        setCars(response.data);
      } else {
        setCars([...cars, ...response.data]);
      }

      setCarHasNext(response.hasNext);
      setCarPage(pageForCar + 1);
    }
    setCarIsLoading(false);

  }

  useEffect(() => {
    getCarBrand(5);
    getCars(4);
  }, []);

  return (
    <Box
      className="flex-1  bg-white"
      style={{ paddingTop: insets.top }}
    >
      <VStack space="3xl" className="flex-1 px-5">
        <Box className="h-1/4  w-full ">
          <Carousel
            loop
            autoPlay={true}
            autoPlayInterval={3000}
            width={screenWidth}
            data={DATA}
            scrollAnimationDuration={1000}
            mode="vertical-stack"
            modeConfig={{
              stackInterval: 18,
              scaleInterval: 0.08,
              showLength: 3,
            }}
            renderItem={({ item }) => (
              <Box className="flex-1 items-center overflow-hidden">
                <Image
                  source={item.img}
                  alt="carousel"
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </Box>
            )}
          />
        </Box>

        <Box className="">
          <Heading size="sm" className="mb-2">Brand</Heading>

          <FlashList
            data={carCategories}
            horizontal={true}
            ItemSeparatorComponent={() => <Box className="w-5" />}
            estimatedItemSize={50}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            onEndReachedThreshold={0.2}
            onEndReached={() => {
              if (!isLoadingForCarCategory && hasNextForCarCategory) {
                getCarBrand(5);
              }
            }}
            renderItem={({ item }) => (
              <Box
                className="items-center justify-center "
              >
                <Avatar size="lg" className="mb-2 bg-blue-600">
                  {/* <AvatarImage
                    source={{ uri: `https://ui-avatars.com/api/?name=${item.name}&background=random&size=128` }}
                    alt={item.name}
                  /> */}

                  <AvatarFallbackText className="text-white">
                    {item.name}
                  </AvatarFallbackText>
                </Avatar>

                <Text numberOfLines={1} className="text-slate-900 font-medium text-sm text-center">
                  {item.name}
                </Text>
              </Box>
            )}
          />
        </Box>

        <Box className="flex-1">
          <Heading size="md" className="mb-2">Available Vehicles</Heading>

          <FlashList
            data={cars}
            numColumns={2}
            contentContainerStyle={{ paddingBottom: 40 }}
            estimatedItemSize={250}
            onEndReachedThreshold={0.2}
            onEndReached={() => {
              if (!isLoadingForCar && hasNextForCar) {
                getCars(4);
              }
            }}
            renderItem={({ item }) => (
              <Box className="flex-1 px-1.5 mb-3">
                <VStack
                  className="bg-white rounded-md border border-slate-100 shadow-sm overflow-hidden"
                  style={{ elevation: 2 }}
                >
                  <Box className="h-32 w-full bg-slate-50 relative">
                    <Image
                      source={{ uri: item.car_photo }}
                      alt={item.car_name}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                    
                  </Box>

                  <VStack className="p-3" space="xs">
                    <Text numberOfLines={1} className="text-slate-800 font-semibold text-sm ">
                      {item.car_name}
                    </Text>

                    <Text className="text-slate-400 text-[10px] font-mono mb-1">
                     {item.car_number}
                    </Text>

                    <HStack className="items-center justify-between">
                      <HStack className="items-baseline">
                        <Text className=" text-gray-800 font-bold text-sm ">
                          ${item.rent_price_per_day}
                        </Text>
                        <Text className=" ml-0.5">/d</Text>
                      </HStack>

                     
                    </HStack>
                  </VStack>
                </VStack>
              </Box>
            )}
          />
        </Box>
      </VStack>
    </Box>
  );
}
