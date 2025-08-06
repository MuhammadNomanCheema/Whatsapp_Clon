import * as ImagePicker from "expo-image-picker";
import { Stack, router } from "expo-router";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useState } from "react";
import {
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { auth, db } from "../firebase";

const uploadToImgbb = async (localUri: string): Promise<string | null> => {
    const apiKey = "6f9515c7595dabf4c63d91ed9d1310e4";

    const formData = new FormData();
    formData.append("image", {
        uri: localUri,
        type: "image/jpeg",
        name: "upload.jpg",
    } as any);

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: "POST",
            body: formData,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        const data = await response.json();
        if (data && data.data && data.data.url) {
            return data.data.url;
        } else {
            console.error("Image upload failed", data);
            return null;
        }
    } catch (error) {
        console.error("Upload error", error);
        return null;
    }
};

export default function EmailSignup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const showAlert = (msg: string) => {
        setAlertMessage(msg);
        setAlertVisible(true);
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSignup = async () => {
        if (!username || !email || !password) {
            return showAlert("Please fill out all fields.");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return showAlert("Please enter a valid email address.");
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            let photoURL = null;
            if (image) {
                photoURL = await uploadToImgbb(image);
            }

            await setDoc(doc(db, "users", user.uid), {
                username: username,
                email: email,
                photoURL: photoURL || null,
                createdAt: serverTimestamp(),
            });

            await sendEmailVerification(user);
            showAlert("Verification email sent! Please check your inbox.");
        } catch (err: any) {
            showAlert(err.message || "Signup failed");
        }
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <SafeAreaView style={styles.container}>
                        <View style={styles.header}>
                            <Text style={styles.heading}>Create Account</Text>
                            <Text style={styles.subtext}>Sign up with your username, email & password</Text>
                        </View>

                        <TouchableOpacity onPress={pickImage} style={{ alignItems: "center", marginVertical: 10 }}>
                            <Image
                                source={image ? { uri: image } : require("@/assets/images/icon.png")}
                                style={{ width: 100, height: 100, borderRadius: 50 }}
                            />
                            <Text style={{ color: "#05AA82", marginTop: 8 }}>Select Profile Picture</Text>
                        </TouchableOpacity>

                        <View style={styles.input}>
                            <TextInput
                                style={styles.inputValue}
                                placeholder="Username"
                                placeholderTextColor="#999"
                                value={username}
                                onChangeText={setUsername}
                            />
                            <View style={styles.fullLine} />

                            <TextInput
                                style={styles.inputValue}
                                placeholder="Email"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholderTextColor="#999"
                                value={email}
                                onChangeText={setEmail}
                            />
                            <View style={styles.fullLine} />

                            <TextInput
                                style={styles.inputValue}
                                placeholder="Password"
                                placeholderTextColor="#999"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                            <View style={styles.fullLine} />
                        </View>

                        <View style={styles.footer}>
                            <TouchableOpacity style={styles.buttonPrimary} onPress={handleSignup}>
                                <Text style={styles.buttonText}>Sign Up</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.buttonDark} onPress={() => router.push("/Screen/PhoneVerify")}>
                                <Text style={styles.buttonText}>Login by Phone Number</Text>
                            </TouchableOpacity>
                        </View>

                        <Modal visible={alertVisible} transparent animationType="fade">
                            <View style={styles.alertOverlay}>
                                <View style={styles.alertBox}>
                                    <Text style={styles.alertTitle}>Message</Text>
                                    <Text style={styles.alertMessage}>{alertMessage}</Text>
                                    <TouchableOpacity onPress={() => setAlertVisible(false)} style={styles.alertButton}>
                                        <Text style={styles.alertButtonText}>OK</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
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
    header: {
        marginTop: verticalScale(40),
        alignItems: "center",
    },
    heading: {
        fontSize: moderateScale(24),
        fontWeight: "bold",
        color: "#000",
    },
    subtext: {
        fontSize: moderateScale(14),
        color: "#666",
        marginTop: verticalScale(10),
        textAlign: "center",
    },
    input: {
        marginTop: verticalScale(30),
    },
    inputValue: {
        fontSize: moderateScale(16),
        color: "#000",
        paddingVertical: verticalScale(10),
    },
    fullLine: {
        width: "100%",
        height: verticalScale(1),
        backgroundColor: "#05AA82",
        marginBottom: verticalScale(20),
    },
    footer: {
        marginBottom: verticalScale(30),
        gap: verticalScale(12),
    },
    buttonPrimary: {
        backgroundColor: "#05AA82",
        paddingVertical: verticalScale(12),
        borderRadius: moderateScale(10),
        alignItems: "center",
    },
    buttonDark: {
        backgroundColor: "#333",
        paddingVertical: verticalScale(12),
        borderRadius: moderateScale(10),
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: moderateScale(16),
    },
    alertOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    alertBox: {
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 24,
        alignItems: "center",
        elevation: 5,
    },
    alertTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#05AA82",
    },
    alertMessage: {
        fontSize: 15,
        color: "#444",
        textAlign: "center",
        marginBottom: 20,
    },
    alertButton: {
        backgroundColor: "#05AA82",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    alertButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 15,
    },
});
