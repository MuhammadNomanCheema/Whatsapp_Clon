import { Text } from "@react-navigation/elements";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

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
                <Text>Anees butt</Text>
            </SafeAreaView>
        </>
    );
}
