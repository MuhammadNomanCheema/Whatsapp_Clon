import { router, Stack } from "expo-router";
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, verticalScale } from "react-native-size-matters";
export default function Login() {


  const handlePrivacy = () => {
    Linking.openURL("https://www.whatsapp.com/legal/privacy-policy");
  };

  const handleTerms = () => {
    Linking.openURL("https://www.whatsapp.com/legal/terms-of-service");
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/Screen.png")}
            style={styles.image}
          />
          <Text style={styles.welcome}>Welcome to ChatSphere</Text>

          <Text style={styles.policyText}>
            Read our{" "}
            <Text style={styles.linkText} onPress={handlePrivacy}>
              Privacy Policy
            </Text>
            . Tap{" "}
            <Text>
              "Agree and Continue"
            </Text>{" "}
            to accept the
            <Text style={styles.linkText} onPress={handleTerms}>Terms of Service.</Text>
          </Text>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.7}
            onPress={() => {
              router.push("/Screen/LoginScreen");
            }}
          >
            <Text style={styles.buttonText}>Agree and Continue</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: verticalScale(20),
    paddingHorizontal: moderateScale(20),
    justifyContent: "space-between",
  },
  header: {
    flex: 1,
    alignItems: "center",
    gap: verticalScale(30),
    justifyContent: "center",
    marginBottom: moderateScale(100),
  },

  image: {
    resizeMode: "contain",
    width: moderateScale(350),
    height: moderateScale(300),
    borderRadius: moderateScale(350),

  },
  loadingText: {
    fontSize: moderateScale(30),
    color: "#867373",
    fontFamily: "cursive",
  },
  loading: {
    fontSize: moderateScale(30),
    color: "#000",
    textTransform: "uppercase",
    fontWeight: "600",
    fontFamily: "cursive",
  },
  welcome: {
    fontSize: moderateScale(25),
    fontWeight: "bold",
    color: "black",
    textAlign: "center",

  },
  policyText: {
    textAlign: "center",
    fontSize: moderateScale(13),
    color: "#444",
    paddingHorizontal: moderateScale(15),
  },
  linkText: {
    color: "#007BFF",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#00A884",
    width: "100%",
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(25),
    alignItems: "center",
    marginTop: verticalScale(10),
  },
  buttonText: {
    color: "white",
    fontSize: moderateScale(16),
    fontWeight: "bold",
  },
});
