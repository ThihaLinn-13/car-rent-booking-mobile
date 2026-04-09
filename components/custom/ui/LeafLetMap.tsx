import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { LeafletView } from 'react-native-leaflet-view';
import Svg, { Circle, Line, Polygon, Text as SvgText } from 'react-native-svg';

type LocationData = Location.LocationObject | null;

export default function LeafLetMap() {
  const [location, setLocation] = useState<LocationData>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [heading, setHeading] = useState<number>(0);
  const [street, setStreet] = useState<string>('Locating...');
  const [township, setTownship] = useState<string>('');
  const locationRef = useRef<LocationData>(null);

  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
        { headers: { 'Accept-Language': 'en', 'User-Agent': 'CarBookingApp/1.0' } }
      );
      const data = await res.json();
      const addr = data?.address ?? {};
      setStreet(addr.road || addr.pedestrian || addr.footway || addr.path || 'Unknown Street');
      setTownship(addr.suburb || addr.town || addr.village || addr.city_district || addr.city || '');
    } catch (error) {
      console.log(error);
      setStreet('Location Pinned');
      setTownship('');
    }
  };

  useEffect(() => {
    let posSub: Location.LocationSubscription | null = null;
    let headingSub: Location.LocationSubscription | null = null;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setStreet('Permission denied');
        return;
      }

      const initial = await Location.getCurrentPositionAsync({});
      setLocation(initial);
      locationRef.current = initial;
      // center map only on first load
      setMapCenter({
        lat: initial.coords.latitude,
        lng: initial.coords.longitude,
      });
      reverseGeocode(initial.coords.latitude, initial.coords.longitude);

      // watch position — update marker only, NOT map center
      posSub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 3000, distanceInterval: 5 },
        (newLoc) => {
          setLocation(newLoc);
          locationRef.current = newLoc;
          reverseGeocode(newLoc.coords.latitude, newLoc.coords.longitude);
        }
      );

      // watch heading for compass rotation
      headingSub = await Location.watchHeadingAsync((h) => {
        setHeading(h.trueHeading ?? h.magHeading ?? 0);
      });
    })();

    return () => {
      posSub?.remove();
      headingSub?.remove();
    };
  }, []);

  // Pan map back to current location without changing zoom
  const goToMyLocation = () => {
    if (locationRef.current) {
      setMapCenter({
        lat: locationRef.current.coords.latitude,
        lng: locationRef.current.coords.longitude,
      });
    }
  };

  if (!location || !mapCenter) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-slate-400 text-sm mt-2">Getting your location...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {/* Map */}
      <LeafletView
        mapCenterPosition={mapCenter}
        zoom={15}
        mapMarkers={[
          {
            id: 'user',
            position: {
              lat: location.coords.latitude,
              lng: location.coords.longitude,
            },
            icon: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
            title: street,
          },
        ]}
      />

      {/* Right-side controls */}
      <View className="absolute top-4 right-4" style={{ gap: 10 }}>

        {/* Go to my location */}
        <Pressable
          onPress={goToMyLocation}
          className="w-12 h-12 rounded-full bg-white items-center justify-center"
          style={{ elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4 }}
        >
          <Svg width={24} height={24} viewBox="0 0 24 24">
            <Circle cx="12" cy="12" r="4" fill="#3b82f6" />
            <Circle cx="12" cy="12" r="7" stroke="#3b82f6" strokeWidth="1.5" fill="none" />
            <Line x1="12" y1="2" x2="12" y2="5" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
            <Line x1="12" y1="19" x2="12" y2="22" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
            <Line x1="2" y1="12" x2="5" y2="12" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
            <Line x1="19" y1="12" x2="22" y2="12" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
          </Svg>
        </Pressable>

        {/* Compass — rotates opposite to heading so N always points north on device */}
        <View
          className="w-12 h-12 rounded-full bg-white items-center justify-center"
          style={{ elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4 }}
        >
          <Svg
            width={40}
            height={40}
            viewBox="0 0 40 40"
            style={{ transform: [{ rotate: `${-heading}deg` }] }}
          >
            {/* Outer ring */}
            <Circle cx="20" cy="20" r="18" stroke="#e2e8f0" strokeWidth="1.5" fill="white" />
            {/* N label */}
            <SvgText x="20" y="10" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#ef4444">N</SvgText>
            {/* S label */}
            <SvgText x="20" y="34" textAnchor="middle" fontSize="6" fill="#94a3b8">S</SvgText>
            {/* North needle — red */}
            <Polygon points="20,6 17,20 20,18 23,20" fill="#ef4444" />
            {/* South needle — grey */}
            <Polygon points="20,34 17,20 20,22 23,20" fill="#94a3b8" />
          </Svg>
        </View>

      </View>

      {/* Bottom info box */}
      <View
        className="absolute bottom-4 left-4 right-4 bg-white rounded-2xl px-4 py-3 shadow-md"
        style={{ elevation: 6 }}
      >
        <View className="flex-row items-center gap-2">
          <Text className="text-blue-500 text-base">📍</Text>
          <View className="flex-1">
            <Text className="text-slate-800 font-semibold text-sm" numberOfLines={1}>
              {street}
            </Text>
            {township ? (
              <Text className="text-slate-400 text-xs mt-0.5" numberOfLines={1}>
                {township}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}
