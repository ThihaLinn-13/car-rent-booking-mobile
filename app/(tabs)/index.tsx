import { getCars } from "@/api/car_api";
import { getCarBrands } from "@/api/car_brand";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
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
  { id: 5, img: require("@/assets/banner/banner_1.jpg") },
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
    if (isLoadingForCarCategory || !hasNextForCarCategory) return;

    setCarCategoryIsLoading(true);
    const response = await getCarBrands(pageForCarCategory, size);

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

  const getCar = async (size: number) => {
    if (isLoadingForCar || !hasNextForCar) return;

    setCarIsLoading(true);

    const response = await getCars(pageForCar, size);

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
    getCar(5);
  }, []);

  return (
    <Box
      className="flex-1  bg-white"
      style={{ paddingTop: insets.top }}
    >
      <>
        <VStack space="3xl" className="flex-1 px-3">
          <Box className="h-1/4  w-full overflow-hidden ">
            <Carousel
              loop
              autoPlay={true}
              autoPlayInterval={3000}
              width={screenWidth}
              data={DATA}
              scrollAnimationDuration={1000}
              mode="parallax"

              modeConfig={{
                parallaxScrollingScale: 1,
                parallaxScrollingOffset: 50,
              }}
              renderItem={({ item }) => (
                <Box className="flex-1 items-center overflow-hidden rounded-sm">
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
            <HStack className="just" >
              <Heading size="sm" className="mb-2">Brand</Heading>
              <Text>see all</Text>
            </HStack>
            <FlashList
              data={carCategories}
              horizontal={true}
              ItemSeparatorComponent={() => <Box className="w-5" />}
              estimatedItemSize={50}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.name}
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
                  <Avatar size="lg" className="mb-2 ">
                    {item.imageUrl ? (
                      <AvatarImage source={{ uri: item.imageUrl }} />
                    ) : (
                      <AvatarFallbackText className="text-white">
                        {item.name}
                      </AvatarFallbackText>
                    )}
                  </Avatar>
                  <Text numberOfLines={1} className="text-slate-900 font-medium text-sm text-center">
                    {item.name}
                  </Text>
                </Box>
              )}
            />
          </Box>

          <Box className="flex-1">
            <Heading size="sm" className="mb-2">Available Vehicles</Heading>

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
                        source={item.imageUrl}
                        alt="carousel"
                        className="w-full h-full"
                        resizeMode="cover"
                      />

                    </Box>

                    <VStack className="p-3" space="xs">
                      <Text numberOfLines={1} className="text-slate-800 font-semibold text-sm ">
                        {item.name}
                      </Text>

                      <Text className="text-slate-400 text-[10px] font-mono mb-1">
                        {item.carNumber}
                      </Text>

                      <HStack className="items-center justify-between">
                        <HStack className="items-baseline">
                          <Text className=" text-gray-800 font-bold text-sm ">
                            ${item.price}
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
      </>
    </Box>
  );
}
