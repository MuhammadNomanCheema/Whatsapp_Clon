// SettingsScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../firebase";
const SettingsScreen = () => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("Hey there! I’m using ChatSphere.");
  const [imageUri, setImageUri] = useState("");

  const [tempName, setTempName] = useState("");
  const [tempBio, setTempBio] = useState("");
  const [tempImage, setTempImage] = useState("");

  const user = auth.currentUser;


  useFocusEffect(
    useCallback(() => {
      if (user) {
        const fetchData = async () => {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setName(data.username || "");
            setBio(data.bio || "Hey there! I’m using ChatSphere.");
            setImageUri(data.photoURL || "");
            setTempName(data.username || "");
            setTempBio(data.bio || "Hey there! I’m using ChatSphere.");
            setTempImage(data.photoURL || "");
          }
        };
        fetchData();
      }
    }, [user])
  );

  const pickImage = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      return Alert.alert("Permission required", "Please enable gallery access.");
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setTempImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    const hasChanges =
      tempName !== name || tempBio !== bio || tempImage !== imageUri;

    if (!hasChanges) {
      Alert.alert("No Changes", "No updates to save.");
      return;
    }

    try {
      let uploadedImageURL = imageUri;

      if (tempImage !== imageUri) {
        const apiKey = "6f9515c7595dabf4c63d91ed9d1310e4";
        const base64 = await FileSystem.readAsStringAsync(tempImage, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const res = await fetch("https://api.imgbb.com/1/upload?key=" + apiKey, {
          method: "POST",
          body: new URLSearchParams({ image: base64 }),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

        const json = await res.json();
        if (!json.success) throw new Error("Image upload failed");
        uploadedImageURL = json.data.url;
      }

      await updateDoc(doc(db, "users", user.uid), {
        username: tempName,
        bio: tempBio,
        photoURL: uploadedImageURL,
      });

      setName(tempName);
      setBio(tempBio);
      setImageUri(uploadedImageURL);
      Alert.alert("Saved", "Your profile has been updated.");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/Screen/LoginScreen");
    } catch (error: any) {
      Alert.alert("Logout Error", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={{ position: "absolute", top: 40, right: 20, zIndex: 99 }}>
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={28} color="#128C7E" />
          </TouchableOpacity>
        </View>
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={pickImage}>
            <Image source={{ uri: tempImage || imageUri }} style={styles.profileImage} />
          </TouchableOpacity>
          <Text style={styles.tapHint}>Tap image to change</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            value={tempName}
            onChangeText={setTempName}
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#aaa"
          />
          <View style={styles.divider} />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>+92 312 1234567</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            value={tempBio}
            onChangeText={setTempBio}
            style={styles.input}
            placeholder="Enter your bio"
            placeholderTextColor="#aaa"
          />
          <View style={styles.divider} />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdfdfd" },
  logoutButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#e74c3c",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    zIndex: 10,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
  imageContainer: { alignItems: "center", marginTop: 80, marginBottom: 10 },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: "#128C7E",
  },
  tapHint: { color: "#888", fontSize: 12, marginTop: 8 },
  section: { paddingHorizontal: 20, paddingVertical: 15, backgroundColor: "#fff" },
  label: { fontSize: 13, color: "#888", marginBottom: 5, letterSpacing: 0.5 },
  input: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#128C7E",
  },
  value: { fontSize: 16, fontWeight: "600", color: "#111", paddingVertical: 6 },
  divider: { height: 1, backgroundColor: "#eee", marginTop: 15 },
  saveButton: {
    marginTop: 30,
    marginHorizontal: 40,
    paddingVertical: 12,
    backgroundColor: "#128C7E",
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "600", letterSpacing: 0.5 },
});
