import { Stack, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export default function OtpVerify() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const inputs = useRef([]);
  const router = useRouter();

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const handleChange = (text, index) => {
    if (!/^\d*$/.test(text)) return;

    if (text.length === 6) {
      const split = text.split("");
      setOtp(split.slice(0, 6));
      inputs.current[5]?.blur();
      return;
    }

    let newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    if (index === 5 && text) {
      inputs.current[index]?.blur();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        inputs.current[index - 1]?.focus();
      } else {
        let newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleVerify = () => {
    const code = otp.join("");
    if (code.length === 6 && !otp.includes("")) {
      router.push("/Screen/Credientail")
    }
  };

  const handleResend = () => {
    if (timer === 0) {
      setOtp(["", "", "", "", "", ""]);
      setTimer(60);
      inputs.current[0]?.focus();
      router.push("/Screen/Resend");
    }
  };

  const isOtpComplete = otp.join("").length === 6 && !otp.includes("");

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}

      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={styles.container}>
            <View style={styles.topContent}>
              <Text style={styles.heading}>Verify OTP</Text>
              <Text style={styles.subtext}>
                Enter the 6-digit code sent to your number.{" "}
                <Text style={styles.wrongNumber} onPress={() => router.back()}>
                  Wrong number?
                </Text>
              </Text>

              <View style={styles.otpContainer}>
                {otp.map((value, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputs.current[index] = ref)}
                    style={styles.otpBox}
                    inputMode="numeric"
                    keyboardType="number-pad"
                    maxLength={1}
                    value={value}
                    onChangeText={(text) => handleChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                  />
                ))}
              </View>

              <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
                <Text style={[styles.resendText, timer > 0 && { color: "#aaa" }]}>
                  {timer > 0 ? `Resend in ${timer}s` : "Resend Code"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity
                style={[
                  styles.verifyButton,
                  !isOtpComplete && { backgroundColor: "#ccc" },
                ]}
                onPress={handleVerify}
                activeOpacity={0.8}
                disabled={!isOtpComplete}
              >
                <Text style={styles.verifyText}>Verify</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: scale(20),
    justifyContent: "space-between",
  },
  topContent: {
    alignItems: "center",
    marginTop: verticalScale(40),
  },
  heading: {
    fontSize: moderateScale(22),
    fontWeight: "bold",
    color: "#000",
    marginBottom: verticalScale(10),
  },
  subtext: {
    fontSize: moderateScale(14),
    color: "#666",
    marginBottom: verticalScale(30),
    textAlign: "center",
    lineHeight: 22,
  },
  wrongNumber: {
    color: "red",
    fontWeight: "600",
    fontSize: moderateScale(14),
  },
  otpContainer: {
    flexDirection: "row",
    gap: scale(10),
    marginBottom: verticalScale(20),
  },
  otpBox: {
    width: scale(40),
    height: scale(50),
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    textAlign: "center",
    fontSize: moderateScale(20),
    color: "#000",
  },
  resendText: {
    color: "#0C42CC",
    fontWeight: "600",
    fontSize: moderateScale(17),
    marginTop: verticalScale(10),
  },
  footer: {
    width: "100%",
    paddingBottom: verticalScale(20),
  },
  verifyButton: {
    backgroundColor: "#05AA82",
    paddingVertical: verticalScale(12),
    borderRadius: 10,
    alignItems: "center",
  },
  verifyText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: moderateScale(16),
  },
});
