import * as Location from 'expo-location';
import React, { useEffect, useState } from "react";
import { LeafletView } from 'react-native-leaflet-view';
import { useSafeAreaInsets } from "react-native-safe-area-context";

type LocationData = Location.LocationObject | null;
export default function LeafLetMap() {

  const insets = useSafeAreaInsets();

  const [location, setLocation] = useState<LocationData>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const YANGON_COORDS = { latitude: 16.8661, longitude: 96.1951 };

  useEffect(() => {
    (async () => {
      // 1. Request permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // 2. Get the current position
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  let text = 'Waiting...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Lat: ${location.coords.latitude}\nLon: ${location.coords.longitude}`;
  }

  return (

    <LeafletView
      mapCenterPosition={{
        lat: location?.coords.latitude,
        lng: location?.coords.longitude
      }}
      zoom={13}
      mapMarkers={[
        {
          id: '1',
          position: {
            lat: location?.coords.latitude,
            lng: location?.coords.longitude
          },
          icon: '📍',
          title: text,
        },
      ]}
      doDebug={false}
    />
  );
}
