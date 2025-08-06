import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Welcome from "./Screen/Welcome";

export default function Index() {
  return (
    <>

      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Welcome />
      </SafeAreaView>
    </>
  );
}
