import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Index() {
  return (
    <SafeAreaView className="flex-1">
      <Box className="bg-slate-600 flex-1">
        <Text>Index Page</Text>
      </Box>
    </SafeAreaView>
  );
}
