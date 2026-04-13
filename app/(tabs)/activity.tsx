import { getActivitiesByUserId } from "@/api/booking_api";
import { useAuth } from "@/store/use-auth-store";
import { Booking } from "@/types/booking";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const now = new Date();

export default function Activity() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const [page, setPage] = useState(0);
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const fetchActivities = useCallback(async (reset = false) => {
    if (!user) return;
    if (!reset && (isLoading || !hasNext)) return;

    const currentPage = reset ? 0 : page;
    setIsLoading(true);

    try {
      const result = await getActivitiesByUserId(
        currentPage,
        10,
        user.id,
        user.role ?? [],
        month,
        year,
      );

      setBookings(prev => reset ? result.data : [...prev, ...result.data]);
      setHasNext(result.hasNext);
      setPage(currentPage + 1);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user, month, year, page, hasNext, isLoading]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setPage(0);
    setHasNext(true);
    await fetchActivities(true);
  }, [fetchActivities]);

  useEffect(() => {
    setBookings([]);
    setPage(0);
    setHasNext(true);
    fetchActivities(true);
  }, [month, year, user?.id]);

  const changeMonth = (delta: number) => {
    let m = month + delta;
    let y = year;
    if (m > 12) { m = 1; y += 1; }
    if (m < 1)  { m = 12; y -= 1; }
    setMonth(m);
    setYear(y);
  };

  const monthLabel = new Date(year, month - 1).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const statusColor = (startDate: string, endDate: string) => {
    const today = new Date().toISOString().split("T")[0];
    if (endDate < today) return { bg: "bg-slate-100 dark:bg-zinc-700", text: "text-slate-500 dark:text-zinc-400", label: "Completed" };
    if (startDate <= today && today <= endDate) return { bg: "bg-green-100 dark:bg-green-900", text: "text-green-600 dark:text-green-400", label: "Active" };
    return { bg: "bg-blue-100 dark:bg-blue-900", text: "text-blue-600 dark:text-blue-400", label: "Upcoming" };
  };

  const renderItem = ({ item }: { item: Booking }) => {
    const status = statusColor(item.startDate, item.endDate);
    const dayCount = Math.ceil((new Date(item.endDate).getTime() - new Date(item.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    return (
      <View
        className="bg-white dark:bg-zinc-800 rounded-2xl mx-4 mb-3 p-4 border border-slate-100 dark:border-zinc-700"
        style={{ elevation: 2 }}
      >
        {/* Status badge */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-slate-400 dark:text-zinc-500 text-[10px] font-mono">
            #{item.id}
          </Text>
          <View className={'px-2.5 py-1 rounded-full ' + status.bg}>
            <Text className={'text-[10px] font-bold ' + status.text}>
              {status.label}
            </Text>
          </View>
        </View>

        {/* Dates */}
        <View className="flex-row items-center mb-2">
          <View className="flex-1 items-center">
            <Text className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-1">
              Check-in
            </Text>
            <Text className="text-sm font-semibold text-slate-800 dark:text-white">
              {item.startDate}
            </Text>
          </View>
          <View className="px-3">
            <Text className="text-slate-300 dark:text-zinc-600 text-lg">→</Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-1">
              Check-out
            </Text>
            <Text className="text-sm font-semibold text-slate-800 dark:text-white">
              {item.endDate}
            </Text>
          </View>
        </View>

        {/* Duration */}
        <View className="pt-2 border-t border-slate-100 dark:border-zinc-700">
          <Text className="text-slate-500 dark:text-zinc-400 text-xs text-center">
            {dayCount} {dayCount === 1 ? 'day' : 'days'}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-slate-50 dark:bg-zinc-900" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-4 pt-3 pb-2">
        <Text className="text-xl font-bold text-slate-800 dark:text-white mb-3">
          My Bookings
        </Text>
        {/* Month navigator */}
        <View className="flex-row items-center justify-between bg-white dark:bg-zinc-800 rounded-2xl px-4 py-2.5 border border-slate-100 dark:border-zinc-700">
          <Pressable onPress={() => changeMonth(-1)} className="p-1">
            <Text className="text-blue-500 text-lg font-bold">‹</Text>
          </Pressable>
          <Text className="text-sm font-semibold text-slate-700 dark:text-white">
            {monthLabel}
          </Text>
          <Pressable onPress={() => changeMonth(1)} className="p-1">
            <Text className="text-blue-500 text-lg font-bold">›</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 32 }}
        onEndReachedThreshold={0.3}
        onEndReached={() => fetchActivities()}
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
            <View className="flex-1 items-center justify-center py-24">
              <Text className="text-4xl mb-3">📋</Text>
              <Text className="text-slate-400 dark:text-zinc-500 text-sm font-medium">
                No bookings for this month
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          isLoading && !isRefreshing ? <ActivityIndicator className="my-6" color="#3b82f6" /> : null
        }
        renderItem={renderItem}
      />
    </View>
  );
}
