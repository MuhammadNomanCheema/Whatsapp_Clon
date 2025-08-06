import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function VideoCall() {
    const { name = "Unknown", avatar } = useLocalSearchParams<{
        name: string;
        avatar?: string;
    }>();
    const router = useRouter();

    const [isMuted, setIsMuted] = useState(false);
    const [isFrontCam, setIsFrontCam] = useState(true);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setDuration((d) => d + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s < 10 ? "0" + s : s}`;
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={styles.container}>
                <Image
                    source={{ uri: avatar || "https://via.placeholder.com/300" }}
                    style={StyleSheet.absoluteFillObject}
                    blurRadius={8}
                />

                {/* Top Info */}
                <View style={styles.topSection}>
                    <Image
                        source={{ uri: avatar || "https://via.placeholder.com/130" }}
                        style={styles.avatar}
                    />
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.status}>Calling • {formatTime(duration)}</Text>
                </View>

                {/* Controls */}
                <View style={styles.controls}>
                    <TouchableOpacity
                        style={[styles.circleBtn, isMuted && styles.activeBtn]}
                        onPress={() => setIsMuted(!isMuted)}
                    >
                        <Ionicons
                            name={isMuted ? "mic-off" : "mic"}
                            size={28}
                            color={isMuted ? "#fff" : "#128C7E"}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.circleBtn}
                        onPress={() => setIsFrontCam(!isFrontCam)}
                    >
                        <Ionicons name="camera-reverse" size={28} color="#128C7E" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.circleBtn, styles.endCall]}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="call" size={28} color="#fff" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 40,
    },
    topSection: {
        marginTop: 80,
        alignItems: "center",
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: "#fff",
        marginBottom: 15,
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
    },
    status: {
        fontSize: 16,
        color: "#ccc",
        marginTop: 4,
    },
    controls: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: "100%",
        paddingHorizontal: 40,
        marginBottom: 20,
    },
    circleBtn: {
        backgroundColor: "#f0f0f0",
        width: 65,
        height: 65,
        borderRadius: 32.5,
        alignItems: "center",
        justifyContent: "center",
    },
    activeBtn: {
        backgroundColor: "#128C7E",
    },
    endCall: {
        backgroundColor: "red",
    },
});
