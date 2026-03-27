import LeafLetMap from "@/components/custom/ui/LeafLetMap";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Map() {

  const insets = useSafeAreaInsets();

  return (
   <LeafLetMap></LeafLetMap>
  );
}
