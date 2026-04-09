import { getCarBrands } from "@/api/car_brand";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { useCarCateogryStore } from "@/store/use-car-category-store";
import { CarBrand } from "@/types/carBrand";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BrandsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const {
    carCategories, setCarCategories,
    isLoading, hasNext, page,
    setPage, setHasNext, setIsLoading,
  } = useCarCateogryStore();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBrands = useCallback(async (reset = false) => {
    if (!reset && (isLoading || !hasNext)) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const currentPage = reset ? 0 : page;
      const response = await getCarBrands(currentPage, 20);
      
      if (response?.data) {
        setCarCategories(currentPage === 0 ? response.data : [...carCategories, ...response.data]);
        setHasNext(response.hasNext);
        setPage(currentPage + 1);
      }
    } catch (err) {
      setError('Failed to load brands. Please try again.');
      console.error('Error fetching brands:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [isLoading, hasNext, page, carCategories]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setPage(0);
    setHasNext(true);
    await fetchBrands(true);
  }, [fetchBrands]);

  useEffect(() => {
    fetchBrands(true);
  }, []);

  const renderItem = ({ item }: { item: CarBrand }) => (
    <Pressable
      className="flex-1 m-2"
      onPress={() => router.push({ pathname: '/cars', params: { brandId: item.id, brandName: item.name } })}
    >
      <View
        className="bg-white dark:bg-zinc-800 rounded-2xl items-center py-4 px-2 border border-slate-100 dark:border-zinc-700"
        style={{ elevation: 2 }}
      >
        <Avatar size="xl" className="mb-3">
          {item.imageUrl
            ? <AvatarImage source={{ uri: item.imageUrl }} />
            : <AvatarFallbackText className="text-white">{item.name}</AvatarFallbackText>
          }
        </Avatar>
        <Text numberOfLines={1} className="text-slate-800 dark:text-white font-semibold text-sm text-center">
          {item.name}
        </Text>
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
        <Text className="text-lg font-bold text-slate-800 dark:text-white">All Brands</Text>
      </View>

      {error && (
        <View className="mx-4 mt-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
          <Text className="text-red-600 dark:text-red-400 text-sm">{error}</Text>
        </View>
      )}

      <FlatList
        data={carCategories}
        numColumns={3}
        key="brands-3col"
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 8, paddingBottom: 32 }}
        onEndReachedThreshold={0.3}
        onEndReached={() => fetchBrands()}
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
              <Text className="text-4xl mb-2">🏷️</Text>
              <Text className="text-slate-400 dark:text-zinc-500 text-sm">No brands found</Text>
            </View>
          ) : null
        }
        ListFooterComponent={isLoading && !isRefreshing ? <ActivityIndicator className="my-4" color="#3b82f6" /> : null}
        renderItem={renderItem}
      />
    </View>
  );
}
