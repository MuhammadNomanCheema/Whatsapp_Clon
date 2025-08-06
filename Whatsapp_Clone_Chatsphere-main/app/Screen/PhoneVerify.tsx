import { AntDesign } from '@expo/vector-icons';
import { router, Stack } from "expo-router";
import { useState } from "react";
import {
  Alert,
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
import CountryPicker from 'react-native-country-picker-modal';
import { SafeAreaView } from "react-native-safe-area-context";
import {
  moderateScale,
  scale,
  verticalScale
} from 'react-native-size-matters';

export default function PhoneVerify() {
  const [countryCode, setCountryCode] = useState('+92');
  const [country, setCountry] = useState('Pakistan');
  const [visible, setVisible] = useState(false);
  const [phone, setPhone] = useState('');

  const handleNext = () => {
    if (phone.trim().length < 10) {
      Alert.alert("Invalid", "Please enter a valid phone number with at least 11 digits.");
      return;
    }
    const fullNumber = `${countryCode} ${phone}`;
    Alert.alert(
      "Is this the correct number?",
      fullNumber,
      [
        {
          text: "edit",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => router.push("/Screen/Otp")
        }
      ]
    );

  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}  >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={styles.container}>
            <View style={styles.header}>
              <View style={styles.headingComponent}>
                <Text style={styles.heading}>Enter your phone number</Text>
                <Text style={styles.link}>
                  ChatSphere will need to verify your phone number.{" "}
                  <Text style={styles.linkHighlight}>What's my number?</Text>
                </Text>
              </View>

              <View style={styles.input}>
                <TouchableOpacity onPress={() => setVisible(true)} style={styles.dropDown}>
                  <Text style={styles.title}>{country}</Text>
                  <AntDesign name="caretdown" size={moderateScale(14)} color="black" />
                </TouchableOpacity>
                <View style={styles.horizontalLine} />
                <View style={styles.inputContainer}>
                  <View style={styles.countryBlock}>
                    <Text style={styles.countryText}>{countryCode}</Text>
                    <View style={styles.shortLine} />
                  </View>
                  <View style={styles.inputBlock}>
                    <TextInput
                      style={styles.inputValue}
                      keyboardType="number-pad"
                      maxLength={10}
                      value={phone}
                      onChangeText={setPhone}
                      placeholder="Phone number"
                      placeholderTextColor="#999"
                    />
                    <View style={styles.fullLine} />
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleNext}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>

            {visible && (
              <CountryPicker
                visible
                withFilter
                withFlag
                withCountryNameButton
                withCallingCode
                onClose={() => setVisible(false)}
                onSelect={(e: any) => {
                  setCountry(e.name);
                  setCountryCode("+" + e.callingCode[0]);
                }}
                containerButtonStyle={styles.pickerContainer}
              />
            )}
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
    justifyContent: 'space-between',

  },
  header: {
    gap: verticalScale(40),
  },
  headingComponent: {
    gap: verticalScale(15),
    paddingHorizontal: scale(20),


  },
  heading: {
    fontSize: moderateScale(20),
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: scale(30),
  },
  link: {
    textAlign: 'center',
    fontSize: moderateScale(13),
    color: '#444',
  },
  linkHighlight: {
    color: '#0C42CC',
    fontWeight: "600",
  },
  input: {
    paddingHorizontal: scale(18),
    paddingVertical: verticalScale(20),
  },
  dropDown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(20),
    borderRadius: moderateScale(8),
  },
  title: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: 'black',
  },
  horizontalLine: {
    width: "100%",
    height: verticalScale(2),
    backgroundColor: "#05AA82",
  },
  inputContainer: {
    flexDirection: 'row',
    gap: scale(15),
    alignItems: 'flex-end',
    marginTop: verticalScale(26),
  },
  countryBlock: {
    alignItems: 'center',
  },
  countryText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: 'black',
  },
  shortLine: {
    width: scale(30),
    height: verticalScale(1),
    backgroundColor: '#05AA82',
    marginTop: verticalScale(4),
  },
  inputBlock: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  inputValue: {
    fontSize: moderateScale(16),
    paddingLeft: scale(10),
    height: verticalScale(40),
    textAlignVertical: 'bottom',
    color: "#000",
  },
  fullLine: {
    width: '100%',
    height: verticalScale(1),
    backgroundColor: '#05AA82',
    marginTop: verticalScale(-3),
  },
  footer: {
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(20),
    width: "100%",
  },
  button: {
    backgroundColor: "#05AA82",
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(25),
    borderRadius: moderateScale(10),
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: moderateScale(16),
    fontWeight: "bold",
  },
  pickerContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: moderateScale(15),
    borderRadius: moderateScale(10),
  }
});
