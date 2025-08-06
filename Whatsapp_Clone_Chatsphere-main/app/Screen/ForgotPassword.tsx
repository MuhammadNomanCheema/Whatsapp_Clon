import { Stack, router } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const FIREBASE_API_KEY = "AIzaSyB4M1Gfry7AlX9jMAZMEdyydj1RtmbsXWg";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const handleReset = async () => {
        if (!email.trim()) {
            setAlertMessage("Please enter your email address.");
            setAlertVisible(true);
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(
                `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${FIREBASE_API_KEY}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        requestType: "PASSWORD_RESET",
                        email: email.trim(),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || "Failed to send reset email");
            }

            setAlertMessage("Reset email sent successfully!");
            setAlertVisible(true);
        } catch (err: any) {
            setAlertMessage(err.message);
            setAlertVisible(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Stack.Screen options={{ title: "Forgot Password" }} />
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <SafeAreaView style={styles.container}>
                    <Text style={styles.title}>Forgot Password</Text>
                    <Text style={styles.subtitle}>Enter your email to receive a password reset link.</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Email Address"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                        placeholderTextColor="#888"
                    />

                    <TouchableOpacity style={styles.button} onPress={handleReset} disabled={loading}>
                        <Text style={styles.buttonText}>
                            {loading ? "Sending..." : "Send Reset Link"}
                        </Text>
                    </TouchableOpacity>

                    {/* Alert Modal */}
                    <Modal
                        visible={alertVisible}
                        transparent
                        animationType="fade"
                        onRequestClose={() => setAlertVisible(false)}
                    >
                        <View style={styles.alertOverlay}>
                            <View style={styles.alertBox}>
                                <Text style={styles.alertTitle}>Notice</Text>
                                <Text style={styles.alertMessage}>{alertMessage}</Text>
                                <TouchableOpacity onPress={() => {
                                    setAlertVisible(false);
                                    if (alertMessage.includes("successfully")) {
                                        router.replace("/Screen/LoginScreen");
                                    }
                                }} style={styles.alertButton}>
                                    <Text style={styles.alertButtonText}>OK</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E6F4F1",
        padding: scale(20),
        justifyContent: "center",
    },
    title: {
        fontSize: moderateScale(26),
        fontWeight: "bold",
        color: "#05AA82",
        textAlign: "center",
        marginBottom: verticalScale(10),
    },
    subtitle: {
        fontSize: moderateScale(14),
        color: "#555",
        textAlign: "center",
        marginBottom: verticalScale(20),
    },
    input: {
        height: verticalScale(50),
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: moderateScale(12),
        paddingHorizontal: scale(15),
        fontSize: moderateScale(15),
        backgroundColor: "#fff",
        marginBottom: verticalScale(15),
    },
    button: {
        backgroundColor: "#05AA82",
        paddingVertical: verticalScale(12),
        borderRadius: moderateScale(12),
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: moderateScale(16),
        fontWeight: "bold",
    },
    // Alert Modal
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
