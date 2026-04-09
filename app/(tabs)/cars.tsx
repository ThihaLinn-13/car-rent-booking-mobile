import { getCars } from "@/api/car_api";
import { Image } from "@/components/ui/image";
import { useBookingStore } from "@/store/booking-store";
import { useCarState } from "@/store/user-car-store";
import { Car } from "@/types/car";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type OddFilter = "all" | "odd" | "even";

const isOddPlate = (carNumber: string): boolean => {
  const digits = carNumber.replace(/\D/g, "");
  if (!digits) return false;
  return parseInt(digits[0]) % 2 !== 0;
};

export default function CarsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { brandId, brandName } = useLocalSearchParams<{ brandId?: string; brandName?: string }>();
  const { setSelectedCardId } = useBookingStore();

  const {
    cars, setCars,
    isLoading, hasNext, page,
    setPage, setHasNext, setIsLoading,
  } = useCarState();

  const [filter, setFilter] = useState<OddFilter>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCars = useCallback(async (reset = false) => {
    if (!reset && (isLoading || !hasNext)) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const currentPage = reset ? 0 : page;
      const response = await getCars(currentPage, 20);
      
      if (response?.data) {
        setCars(currentPage === 0 ? response.data : [...cars, ...response.data]);
        setHasNext(response.hasNext);
        setPage(currentPage + 1);
      }
    } catch (err) {
      setError('Failed to load cars. Please try again.');
      console.error('Error fetching cars:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [isLoading, hasNext, page, cars]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setPage(0);
    setHasNext(true);
    await fetchCars(true);
  }, [fetchCars]);

  useEffect(() => {
    fetchCars(true);
  }, []);

  const filteredCars = cars.filter((car) => {
    // TODO: Add brand filtering when API supports it
    // if (brandId && car.brandId !== brandId) return false;
    
    if (filter === "all") return true;
    if (filter === "odd") return isOddPlate(car.carNumber);
    return !isOddPlate(car.carNumber);
  });

  const FilterChip = ({ label, value }: { label: string; value: OddFilter }) => (
    <Pressable
      onPress={() => setFilter(value)}
      className={'px-4 py-1.5 rounded-full mr-2 border ' + (
        filter === value
          ? "bg-blue-500 border-blue-500"
          : "bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700"
      )}
    >
      <Text className={'text-sm font-medium ' + (filter === value ? "text-white" : "text-slate-600 dark:text-zinc-300")}>
        {label}
      </Text>
    </Pressable>
  );

  const renderItem = ({ item }: { item: Car }) => (
    <Pressable
      onPress={() => {
        setSelectedCardId(item);
        router.push(`/vehicle/${item.id}` as any);
      }}
    >
      <View
        className="bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-zinc-700 flex-row mx-4 mb-3"
        style={{ elevation: 2 }}
      >
        {/* Image */}
        <View className="w-28 h-24 bg-slate-100 dark:bg-zinc-700 relative">
          <Image source={item.imageUrl} alt={item.name} className="w-full h-full" resizeMode="cover" />
          <View
            className={'absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md ' + (
              isOddPlate(item.carNumber) ? "bg-orange-500" : "bg-blue-500"
            )}
          >
            <Text className="text-white text-[9px] font-bold">
              {isOddPlate(item.carNumber) ? "ODD" : "EVEN"}
            </Text>
          </View>
        </View>
        {/* Info */}
        <View className="flex-1 px-3 py-2.5 justify-between">
          <View>
            <Text numberOfLines={1} className="text-slate-800 dark:text-white font-semibold text-sm mb-0.5">
              {item.name}
            </Text>
            <Text className="text-slate-400 dark:text-zinc-400 text-[10px] font-mono">
              {item.carNumber}
            </Text>
          </View>
          <Text className="text-blue-500 font-bold text-sm">
            ${item.price}
            <Text className="text-slate-400 dark:text-zinc-400 text-[10px] font-normal"> /day</Text>
          </Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View className="flex-1 bg-slate-50 dark:bg-zinc-900" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-slate-100 dark:border-zinc-800">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-blue-500 text-base">← Back</Text>
        </Pressable>
        <Text className="text-lg font-bold text-slate-800 dark:text-white flex-1">
          {brandName ? brandName + ' Cars' : 'All Cars'}
        </Text>
        <Text className="text-slate-400 dark:text-zinc-400 text-xs">{filteredCars.length} cars</Text>
      </View>

      {/* Filter chips */}
      <View className="flex-row px-4 py-3">
        <FilterChip label="All" value="all" />
        <FilterChip label="Odd Plate" value="odd" />
        <FilterChip label="Even Plate" value="even" />
      </View>

      {error && (
        <View className="mx-4 mb-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
          <Text className="text-red-600 dark:text-red-400 text-sm">{error}</Text>
        </View>
      )}

      <FlatList
        data={filteredCars}
        numColumns={1}
        key="cars-1col"
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 32 }}
        onEndReachedThreshold={0.3}
        onEndReached={() => fetchCars()}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#3b82f6']}
            tintColor="#3b82f6"
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-4xl mb-2">🚗</Text>
              <Text className="text-slate-400 dark:text-zinc-500 text-sm">No cars found</Text>
            </View>
          ) : null
        }
        ListFooterComponent={isLoading && !isRefreshing ? <ActivityIndicator className="my-4" color="#3b82f6" /> : null}
        renderItem={renderItem}
      />
    </View>
  );
}
