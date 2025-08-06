import { Stack, router } from "expo-router";
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
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const FIREBASE_API_KEY = "AIzaSyB4M1Gfry7AlX9jMAZMEdyydj1RtmbsXWg";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const showAlert = (message: string) => {
        setAlertMessage(message);
        setAlertVisible(true);
    };

    const handleLogin = async () => {
        if (!email || !password) {
            showAlert("Please enter both email and password.");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(
                `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email,
                        password,
                        returnSecureToken: true,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || "Login failed");
            }

            router.push("/Screen/HomePage");
        } catch (err: any) {
            showAlert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = () => {
        router.push("/Screen/SignUp");
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <SafeAreaView style={styles.container}>
                        <View style={styles.logoBox}>
                            <Image source={require("@/assets/images/icon.png")} style={styles.logo} />
                            <Text style={styles.appName}>ChatSphere</Text>
                        </View>

                        <View style={styles.card}>
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor="#999"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor="#999"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity onPress={() => router.push("/Screen/ForgotPassword")}>
                                <Text style={styles.forgotText}>Forgot Password?</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
                                <Text style={styles.loginText}>{loading ? "Logging in..." : "Log In"}</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={handleSignup}>
                            <Text style={styles.signupText}>
                                Don't have an account? <Text style={styles.underline}>Sign up</Text>
                            </Text>
                        </TouchableOpacity>

                        {/* Custom Alert Modal */}
                        <Modal visible={alertVisible} transparent animationType="fade" onRequestClose={() => setAlertVisible(false)}>
                            <View style={styles.alertOverlay}>
                                <View style={styles.alertBox}>
                                    <Text style={styles.alertTitle}>Oops!</Text>
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
        backgroundColor: "#E6F4F1",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: scale(20),
    },
    logoBox: {
        alignItems: "center",
        marginBottom: verticalScale(20),
    },
    logo: {
        width: scale(90),
        height: scale(90),
        borderRadius: 20,
        marginBottom: verticalScale(8),
    },
    appName: {
        fontSize: moderateScale(26),
        fontWeight: "bold",
        color: "#05AA82",
    },
    card: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: scale(20),
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 6,
        marginBottom: verticalScale(30),
    },
    input: {
        width: "100%",
        height: verticalScale(50),
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: moderateScale(12),
        paddingHorizontal: scale(15),
        fontSize: moderateScale(15),
        color: "#000",
        marginBottom: verticalScale(15),
        backgroundColor: "#F9F9F9",
    },
    loginButton: {
        backgroundColor: "#05AA82",
        paddingVertical: verticalScale(12),
        borderRadius: moderateScale(12),
        alignItems: "center",
        marginTop: verticalScale(5),
    },
    loginText: {
        color: "#fff",
        fontSize: moderateScale(16),
        fontWeight: "bold",
    },
    signupText: {
        fontSize: moderateScale(14),
        color: "#444",
    },
    underline: {
        color: "#0C42CC",

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
        elevation: 5,
    },
    alertTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#E53935",
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
    forgotText: {
        color: "#0C42CC",
        fontWeight: "500",
        textAlign: "center", // ⬅️ change from 'right' to 'center'
        marginBottom: verticalScale(10),
    },


});
