import { SkeletonBox } from "@/components/custom/ui/Skeleton";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { VStack } from "@/components/ui/vstack";
import { Colors } from "@/constant/Color";
import { useBookingStore } from "@/store/booking-store";
import { useCarState } from "@/store/use-car-store";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList, Pressable, RefreshControl, Text,
  useColorScheme,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type PlateFilter = "all" | "odd" | "even";

const isOddPlate = (carNumber: string): boolean => {
  const digits = carNumber.replace(/\D/g, "");
  if (!digits) return false;
  return parseInt(digits[0]) % 2 !== 0;
};

export default function CarsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useColorScheme() ?? "light";
  const { setSelectedCar } = useBookingStore();
  const [filter, setFilter] = useState<PlateFilter>("all");
  const [refreshing, setRefreshing] = useState(false);

  const { cars, getCars, isLoading, hasNext } = useCarState();

  useEffect(() => {
    if (cars.length === 0) getCars();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    useCarState.setState({ page: 0, hasNext: true, cars: [] });
    await getCars();
    setRefreshing(false);
  };

  const filteredCars = cars.filter((car) => {
    if (filter === "all") return true;
    if (filter === "odd") return isOddPlate(car.carNumber);
    return !isOddPlate(car.carNumber);
  });

  const FilterChip = ({ label, value }: { label: string; value: PlateFilter }) => (
    <Pressable
      onPress={() => setFilter(value)}
      className={
        "px-4 py-1.5 rounded-full border " +
        (filter === value
          ? "bg-blue-500 border-blue-500"
          : "bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700")
      }
    >
      <Text
        className={
          "text-xs font-medium " +
          (filter === value
            ? "text-white"
            : "text-slate-600 dark:text-zinc-300")
        }
      >
        {label}
      </Text>
    </Pressable>
  );

  const renderSkeleton = () => (
    <Box className="bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-zinc-700 mx-4 mb-3">
      <SkeletonBox width="100%" height={180} borderRadius={0} />
      <VStack className="p-3" space="xs">
        <SkeletonBox width="70%" height={13} borderRadius={4} />
        <HStack className="justify-between items-center">
          <SkeletonBox width="40%" height={10} borderRadius={4} />
          <SkeletonBox width="25%" height={13} borderRadius={4} />
        </HStack>
      </VStack>
    </Box>
  );

  const renderItem = ({ item }: { item: any }) => (
    <Pressable
      onPress={() => {
        setSelectedCar(item);
        router.push(`/vehicle/${item.id}`);
      }}
    >
      <Box className="bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-zinc-700 mx-4 mb-3">
        {/* Full width image */}
        <Box className="w-full h-44 bg-slate-100 dark:bg-zinc-700">
          <Image
            source={{ uri: item.imageUrl }}
            alt={item.name}
            className="w-full h-full"
            resizeMode="cover"
          />
        </Box>

        {/* Info */}
        <HStack className="px-3.5 py-3 justify-between items-center">
          <VStack className="flex-1 mr-3">
            <Text
              numberOfLines={1}
              className="text-slate-800 dark:text-white font-semibold text-sm"
            >
              {item.name}
            </Text>
            <Text className="text-slate-400 dark:text-zinc-400 text-xs font-mono">
              {item.carNumber}
            </Text>
          </VStack>

          <Text className="text-blue-500 font-bold text-sm">
            ${item.price}
            <Text className="text-slate-400 dark:text-zinc-400 text-[10px] font-normal">
              {" "}/day
            </Text>
          </Text>
        </HStack>
      </Box>
    </Pressable>
  );

  return (
    <View
      className="flex-1 bg-slate-50 dark:bg-zinc-900"
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
      <VStack className="px-4 pt-3 pb-0 bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800">
        
        <HStack className="items-center justify-between pb-3">
          <HStack space="sm">
            <FilterChip label="All" value="all" />
            <FilterChip label="Odd plate" value="odd" />
            <FilterChip label="Even plate" value="even" />
          </HStack>
          <Text className="text-slate-400 dark:text-zinc-400 text-xs">
            {filteredCars.length} total
          </Text>
        </HStack>
      </VStack>

      <FlatList
        data={
          isLoading && cars.length === 0
            ? Array(6).fill(null)
            : filteredCars
        }
        keyExtractor={(item, index) => item?.id ?? `skeleton-car-${index}`}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 32 }}
        onEndReachedThreshold={0.3}
  showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (!isLoading && hasNext) getCars();
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors[theme].tabActive}
            colors={[Colors[theme].tabActive]}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <VStack className="items-center justify-center py-20" space="sm">
              <Text className="text-4xl">🚗</Text>
              <Text className="text-slate-400 dark:text-zinc-500 text-sm">
                No cars found
              </Text>
            </VStack>
          ) : null
        }
        renderItem={({ item }) =>
          !item ? renderSkeleton() : renderItem({ item })
        }
      />
    </View>
  );
}