import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export default function ResendOptionsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleResend = (method) => {
    if (method === "sms") {
      setAlertMessage("Verification code will be sent via SMS.");
    } else if (method === "call") {
      setAlertMessage("You will receive a phone call with your OTP code.");
    }
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Resend Verification Code</Text>
      <Text style={styles.subtext}>
        Choose how you'd like to receive your code.
      </Text>

      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionCard} onPress={() => handleResend("sms")}>
          <MaterialIcons name="sms" size={28} color="#05AA82" />
          <Text style={styles.optionText}>Send via SMS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={() => handleResend("call")}>
          <AntDesign name="phone" size={26} color="#0C42CC" />
          <Text style={styles.optionText}>Send via Phone Call</Text>
        </TouchableOpacity>
      </View>

      {/* Custom Alert Modal */}
      <Modal transparent={true} visible={modalVisible} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.alertBox}>
            <Text style={styles.alertTitle}>Confirmation</Text>
            <Text style={styles.alertMessage}>{alertMessage}</Text>
            <TouchableOpacity
              style={styles.alertButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.alertButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(20),
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  heading: {
    fontSize: moderateScale(22),
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: verticalScale(10),
  },
  subtext: {
    fontSize: moderateScale(14),
    color: "#666",
    textAlign: "center",
    marginBottom: verticalScale(30),
  },
  optionsContainer: {
    gap: verticalScale(20),
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: scale(15),
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  optionText: {
    marginLeft: scale(15),
    fontSize: moderateScale(16),
    color: "#333",
    fontWeight: "500",
  },

  // Modal Styles
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: scale(20),
    borderRadius: 12,
    alignItems: "center",
    elevation: 5,
  },
  alertTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    marginBottom: verticalScale(10),
    color: "#05AA82",
  },
  alertMessage: {
    fontSize: moderateScale(14),
    color: "#444",
    textAlign: "center",
    marginBottom: verticalScale(20),
  },
  alertButton: {
    backgroundColor: "#05AA82",
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(25),
    borderRadius: 8,
  },
  alertButtonText: {
    color: "#fff",
    fontSize: moderateScale(14),
    fontWeight: "600",
  },
});
