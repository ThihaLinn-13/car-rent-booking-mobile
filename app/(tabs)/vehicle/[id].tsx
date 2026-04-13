import { addBooking } from '@/api/booking_api';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { useBookingStore } from '@/store/booking-store';
import { useAuth } from '@/store/use-auth-store';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const calcDays = (a: string, b: string): number =>
    (new Date(b).getTime() - new Date(a).getTime()) / (1000 * 60 * 60 * 24) + 1;

export default function VehicleDetailScreen() {
    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams();
    const { user } = useAuth();
    const [isBooking, setIsBooking] = useState(false);

    const {
        selectedCar,
        bookedDates,
        getBookedDayByMonth,
        setPeriod,
        setSelectedStartDate,
        setSelectedEndDate,
        refreshMarkedDates,
        selectedMonth,
        selectedYear,
        selectedStartDate,
        selectedEndDate
    } = useBookingStore();

    useEffect(() => {
        setSelectedStartDate(null);
        setSelectedEndDate(null);
        getBookedDayByMonth();
    }, [selectedMonth, selectedYear, id]);

    const handleDayPress = (day: any) => {
        const selectedDate = day.dateString;
        if (bookedDates[selectedDate]?.marked) return;

        if (selectedStartDate == null && selectedEndDate == null) {
            setSelectedStartDate(selectedDate);
            setSelectedEndDate(selectedDate);
        } else if (selectedStartDate === selectedEndDate) {
            if (selectedDate < selectedEndDate!) {
                setSelectedStartDate(selectedDate);
                setSelectedEndDate(selectedDate);
            } else {
                setSelectedEndDate(selectedDate);
            }
        } else {
            setSelectedStartDate(selectedDate);
            setSelectedEndDate(selectedDate);
        }

        refreshMarkedDates();
    };

    const handleBooking = async () => {
        if (!user) {
            Alert.alert('Sign in required', 'Please sign in to book a vehicle.');
            return;
        }
        if (!selectedStartDate || !selectedEndDate) {
            Alert.alert('Select dates', 'Please select a start and end date.');
            return;
        }
        setIsBooking(true);
        try {
            const bookingId = await addBooking({
                carId:selectedCar?.id!,
                userId:user.id,
                startDate:selectedStartDate,
                endDate:selectedEndDate
            })
            if (bookingId) {
                Alert.alert('Booking confirmed', 'Booked from ' + selectedStartDate + ' to ' + selectedEndDate);
                setSelectedStartDate(null);
                setSelectedEndDate(null);
            } else {
                Alert.alert('Error', 'Failed to create booking. Please try again.');
            }
        } catch {
            Alert.alert('Error', 'Failed to create booking. Please try again.');
        } finally {
            setIsBooking(false);
        }
    };

    // check if any date in the selected range overlaps with already booked dates
    const hasOverlap = (): boolean => {
        if (!selectedStartDate || !selectedEndDate) return false;
        let curr = new Date(selectedStartDate);
        const last = new Date(selectedEndDate);
        while (curr <= last) {
            const ds = curr.toISOString().split('T')[0];
            if (bookedDates[ds]?.marked) return true;
            curr.setDate(curr.getDate() + 1);
        }
        return false;
    };

    const hasConflict = hasOverlap();
    const canBook = !!selectedStartDate && !!selectedEndDate && !isBooking && !hasConflict;
    const days = selectedStartDate && selectedEndDate ? calcDays(selectedStartDate, selectedEndDate) : 0;
    const pricePerDay = parseFloat(selectedCar?.price ?? '0');
    const total = days * pricePerDay;

    const getButtonText = () => {
        if (isBooking) return 'Booking...';
        if (hasConflict) return 'Dates Unavailable';
        if (days >= 1) return 'Book for $' + total.toFixed(2);
        return 'Select Dates';
    };

    return (
        <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-3 pb-28">

                {/* Image */}
                <View className="h-52 rounded-2xl overflow-hidden mb-4 bg-slate-200">
                    {selectedCar?.imageUrl ? (
                        <Image
                            source={{ uri: selectedCar.imageUrl }}
                            alt={selectedCar?.name ?? 'Car'}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    ) : (
                        <View className="flex-1 items-center justify-center">
                            <Text className="text-slate-400 text-sm">No Image</Text>
                        </View>
                    )}
                </View>

                {/* Info card */}
                <View className="bg-white rounded-2xl px-3 py-2.5 mb-3 shadow-sm">
                    <Text className="text-lg font-bold text-slate-800 mb-2">
                        {selectedCar?.name ?? '—'}
                    </Text>
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center bg-slate-100 rounded-lg px-2 py-1">
                            <Text className="text-xs text-slate-400 font-mono">
                                {selectedCar?.carNumber ?? ''}
                            </Text>
                        </View>
                        <View className="flex-row items-baseline">
                            <Text className="text-xl font-extrabold text-blue-500">
                                ${selectedCar?.price}
                            </Text>
                            <Text className="text-slate-400 text-xs ml-1">/ day</Text>
                        </View>
                    </View>
                </View>

                {/* Calendar */}
                <View className="bg-white rounded-2xl p-2 mb-3 shadow-sm">
                    <Calendar
                        markingType="period"
                        minDate={new Date().toISOString().split('T')[0]}
                        onMonthChange={(date) => setPeriod(date.month, date.year)}
                        onDayPress={handleDayPress}
                        markedDates={bookedDates}
                        theme={{
                            backgroundColor: '#ffffff',
                            calendarBackground: '#ffffff',
                            textSectionTitleColor: '#AEB8C4',
                            monthTextColor: '#1e293b',
                            textMonthFontWeight: '700',
                            dayTextColor: '#334155',
                            todayTextColor: '#3b82f6',
                            textDisabledColor: '#D0D5DD',
                            selectedDayBackgroundColor: '#3b82f6',
                            selectedDayTextColor: '#ffffff',
                            textDayFontSize: 14,
                            textMonthFontSize: 16,
                            textDayHeaderFontSize: 13,
                        }}
                        renderArrow={(direction) => (
                            <Text className="text-blue-500 text-lg">
                                {direction === 'left' ? '←' : '→'}
                            </Text>
                        )}
                    />
                </View>

                {/* Date summary */}
                {selectedStartDate && (
                    <View className="bg-white rounded-2xl overflow-hidden mb-3 shadow-sm">
                        <View className="flex-row">
                            <View className="flex-1 items-center py-3 border-r border-slate-100">
                                <Text className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">
                                    Check-in
                                </Text>
                                <Text className="text-sm font-semibold text-slate-800">
                                    {selectedStartDate}
                                </Text>
                            </View>
                            <View className="flex-1 items-center py-3">
                                <Text className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">
                                    Check-out
                                </Text>
                                <Text className={`text-sm font-semibold text-slate-800`}>
                                    {selectedEndDate}
                                </Text>
                            </View>
                        </View>

                        {days >= 1 && (
                            <View className="flex-row justify-between items-center px-4 py-2.5 bg-blue-50 border-t border-blue-100">
                                <Text className="text-blue-400 text-xs">
                                    {days} days × ${pricePerDay}
                                </Text>
                                <Text className="text-base font-bold text-blue-600">
                                    ${total.toFixed(2)}
                                </Text>
                            </View>
                        )}
                    </View>
                )}

            </ScrollView>

            {/* Sticky footer */}
            <View
                className="absolute bottom-0 left-0 right-0 bg-white px-4 pt-4 border-t border-slate-100"
                style={{ paddingBottom: insets.bottom + 12 }}
            >
                <Pressable
                    className={'rounded-2xl py-4 items-center ' + (canBook ? 'bg-blue-500' : 'bg-blue-200')}
                    onPress={handleBooking}
                    disabled={!canBook}
                >
                    <Text className="text-white text-base font-bold">
                        {getButtonText()}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}
