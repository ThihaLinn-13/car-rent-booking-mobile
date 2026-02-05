import { Box } from "@/components/ui/box";
import React from "react";
import MapView from 'react-native-maps';

import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Map() {

      const insets = useSafeAreaInsets();
    
  return (
    <Box className=" flex-1 bg-slate-100" style={{paddingTop:insets.top}}>
        <Box className="flex-1">
          <MapView ></MapView>
        </Box>
      </Box>
  );
}
