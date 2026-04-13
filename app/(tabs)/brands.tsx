import { SkeletonBox } from "@/components/custom/ui/Skeleton";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Colors } from "@/constant/Color";
import { useCarCateogryStore } from "@/store/use-car-category-store";
import { CarBrand } from "@/types/carBrand";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList, Pressable, RefreshControl, Text,
  useColorScheme, View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BrandsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useColorScheme() ?? "light";
  const [refreshing, setRefreshing] = useState(false);

  const {
    carCategories, getCarBrands,
    isLoading, hasNext,
  } = useCarCateogryStore();

  useEffect(() => {
    if (carCategories.length === 0) getCarBrands();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    useCarCateogryStore.setState({ page: 0, hasNext: true, carCategories: [] });
    await getCarBrands();
    setRefreshing(false);
  };

  const renderSkeleton = (_: any, index: number) => (
    <Box key={`skeleton-brand-${index}`} className="flex-1 m-2">
      <VStack className="bg-white dark:bg-zinc-800 rounded-2xl items-center py-4 px-2 border border-slate-100 dark:border-zinc-700" space="sm">
        <SkeletonBox width={64} height={64} borderRadius={32} />
        <SkeletonBox width={50} height={10} borderRadius={4} />
      </VStack>
    </Box>
  );

  const renderItem = ({ item }: { item: CarBrand }) => (
    <Pressable
      className="flex-1 m-2"
      onPress={() => router.push({ pathname: '/cars', params: { brandId: item.id, brandName: item.name } })}
    >
      <VStack className="bg-white dark:bg-zinc-800 rounded-2xl items-center py-4 px-2 border border-slate-100 dark:border-zinc-700" space="sm">
        <Avatar size="xl">
          {item.imageUrl
            ? <AvatarImage source={{ uri: item.imageUrl }} />
            : <AvatarFallbackText className="text-white">{item.name}</AvatarFallbackText>
          }
        </Avatar>
        <Text numberOfLines={1} className="text-slate-800 dark:text-white font-semibold text-sm text-center">
          {item.name}
        </Text>
      </VStack>
    </Pressable>
  );

  return (
    <View className="flex-1 bg-slate-50 dark:bg-zinc-900" style={{ paddingTop: insets.top }}>

      {/* Header */}
      <HStack className="px-4 pt-3 pb-3 bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800 items-center justify-between">
        <Text className="text-xl font-bold text-slate-800 dark:text-white">
          Brands
        </Text>
        <Text className="text-slate-400 dark:text-zinc-400 text-xs">
          {carCategories.length} total
        </Text>
      </HStack>

      <FlatList
        data={
          isLoading && carCategories.length === 0
            ? Array(9).fill(null)
            : carCategories
        }
        numColumns={3}
        key="brands-3col"
        keyExtractor={(item, index) => item?.id ?? `skeleton-brand-${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 8, paddingBottom: 32 }}
        onEndReachedThreshold={0.3}
        onEndReached={() => { if (!isLoading && hasNext) getCarBrands(); }}
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
              <Text className="text-4xl">🏷️</Text>
              <Text className="text-slate-400 dark:text-zinc-500 text-sm">No brands found</Text>
            </VStack>
          ) : null
        }
        renderItem={({ item, index }) =>
          !item ? renderSkeleton(item, index) : renderItem({ item })
        }
      />
    </View>
  );
}