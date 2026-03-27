import LeafLetMap from "@/components/custom/ui/LeafLetMap";
import { Box } from "@/components/ui/box";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Map() {

  const insets = useSafeAreaInsets();

  return (
    <Box className="flex-1  bg-white"
      style={{ paddingTop: insets.top }}>
      <LeafLetMap></LeafLetMap>
    </Box>
  );
}
