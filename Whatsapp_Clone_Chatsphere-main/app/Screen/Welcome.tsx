import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Welcome() {
  const [showLoadingText, setShowLoadingText] = useState(true);

  let navigerter_to_login = () => {
    router.push("/Screen/Login");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoadingText(false);


      setTimeout(() => {
        navigerter_to_login();
      }, 2000);

    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Image
          source={require("@/assets/images/icon.png")}
          style={styles.image}
        />
      </View>

      <View style={styles.TextContainer}>
        <View style={styles.loadingArea}>
          {showLoadingText ? (
            <>
              <Text style={styles.loadingText}>From</Text>
              <Text style={styles.loading}>Gift</Text>
            </>
          ) : (
            <ActivityIndicator size="large" color="seagreen" />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    marginLeft: 30,
    marginTop: -20,
  },
  loadingText: {
    fontSize: 35,
    fontFamily: "cursive",
    marginLeft: 30,
    marginBottom: 5,
  },
  loading: {
    fontSize: 35,
    fontFamily: "cursive",
    marginLeft: 33,
    marginTop: -10,
  },
  TextContainer: {
    marginBottom: 25,
    alignItems: "center",
  },
  loadingArea: {
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
});
