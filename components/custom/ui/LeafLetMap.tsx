import { Box } from "@/components/ui/box";
import React from "react";
import { LeafletView } from 'react-native-leaflet-view';
import { useSafeAreaInsets } from "react-native-safe-area-context";
export default function LeafLetMap() {

  const insets = useSafeAreaInsets();

  const YANGON_COORDS = { latitude: 16.8661, longitude: 96.1951 };

  return (
    <Box  className="flex-1  bg-white"
      style={{ paddingTop: insets.top }}>
      <LeafletView
        mapCenterPosition={{ 
          lat: YANGON_COORDS.latitude, 
          lng: YANGON_COORDS.longitude 
        }}
        zoom={13}
        mapMarkers={[
          {
            id: '1',
            position: { lat: 16.8661, lng: 96.1951 },
            icon: '📍',
            title: 'Yangon City Center',
          },
        ]}
        doDebug={false}
      />
    </Box>
  );
}
