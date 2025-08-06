import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, Stack } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  moderateScale,
  scale,
  verticalScale,
} from "react-native-size-matters";

export default function CredentialScreen() {
  const [username, setUsername] = useState("");
  const [image, setImage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isPicking, setIsPicking] = useState(false);

  const pickImage = async () => {
    setIsPicking(true);
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission required to upload image.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong while picking the image.");
      console.log("Image Picker Error:", error);
    } finally {
      setIsPicking(false);
    }
  };

  const handleNext = () => {
    if (!username.trim()) {
      Alert.alert("Invalid", "Please enter a username.");
      return;
    }
    router.push("/Screen/HomePage");
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.heading}>Profile Info</Text>
          <Text style={styles.subtext}>
            Please provide your name and optional profile photo
          </Text>

          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
            {isPicking ? (
              <Text>Loading...</Text>
            ) : image ? (
              <Image source={{ uri: image }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="camera" size={28} color="#999" />
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.inputWrapper}>
            <View style={styles.inputRow}>
              <TextInput
                placeholder="Enter your name"
                value=""
                onFocus={() => setShowEmojiPicker(false)}
                onChangeText={setUsername}
                placeholderTextColor="#999"
                style={styles.underlineInput}
              />
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  setTimeout(() => setShowEmojiPicker(true), 100);
                }}
              >
                <Ionicons name="happy-outline" size={24} color="#555" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextText}>Next</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={showEmojiPicker} animationType="slide">
          <SafeAreaView style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={() => setShowEmojiPicker(false)}
              style={{ padding: 10, alignSelf: "flex-end" }}
            >
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
            <EmojiSelector
              category={Categories.symbols}
              onEmojiSelected={(emoji) => {
                console.log("Selected emoji:", emoji);
                // const selectedEmoji = typeof emoji === "string" ? emoji : emoji.emoji;

                // // if (typeof selectedEmoji === "string") {
                // //   setUsername((prev) => prev + selectedEmoji);
                // // } else {
                // //   console.warn("Unknown emoji format:", emoji);
                // // }

                // setShowEmojiPicker(false);
              }}

              showSearchBar={false}
              showTabs={true}
            />
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(20),
  },
  heading: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    textAlign: "center",
    color: "#05AA82",
    marginTop: moderateScale(40),
  },
  subtext: {
    textAlign: "center",
    fontSize: moderateScale(13),
    color: "#777",
    marginVertical: verticalScale(10),
  },
  avatarContainer: {
    alignSelf: "center",
    marginVertical: verticalScale(30),
  },
  avatarPlaceholder: {
    width: scale(100),
    height: scale(100),
    borderRadius: 50,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: scale(100),
    height: scale(100),
    borderRadius: 50,
  },
  inputWrapper: {
    width: "100%",
  },
  inputRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#05AA82",
    alignItems: "center",
    paddingBottom: verticalScale(8),
  },
  underlineInput: {
    flex: 1,
    fontSize: moderateScale(16),
    color: "#000",
  },
  bottomButtonContainer: {
    padding: scale(10),
    backgroundColor: "#fff",
  },
  nextButton: {
    backgroundColor: "#05AA82",
    paddingVertical: verticalScale(12),
    borderRadius: 10,
    alignItems: "center",
    width: "95%",
    marginBottom: moderateScale(10),
    marginLeft: moderateScale(8),
  },
  nextText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontWeight: "600",
  },
});
