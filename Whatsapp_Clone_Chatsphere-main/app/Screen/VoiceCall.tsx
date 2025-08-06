import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function VoiceCall() {
    const { name = 'Unknown', avatar } = useLocalSearchParams<{
        name: string;
        avatar?: string;
    }>();
    const router = useRouter();

    const [isMuted, setIsMuted] = useState(false);
    const [isSpeakerOn, setIsSpeakerOn] = useState(false);
    const [callDuration, setCallDuration] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setCallDuration((prev) => prev + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={styles.container}>
                <View style={styles.topSection}>
                    <Image
                        source={{
                            uri: avatar || 'https://via.placeholder.com/130',
                        }}
                        style={styles.avatar}
                    />
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.callingText}>Voice call • {formatTime(callDuration)}</Text>
                </View>

                <View style={styles.controlsContainer}>
                    <TouchableOpacity
                        style={[styles.circleBtn, isMuted && styles.activeBtn]}
                        onPress={() => setIsMuted(!isMuted)}
                    >
                        <Ionicons
                            name={isMuted ? 'mic-off' : 'mic'}
                            size={28}
                            color={isMuted ? '#fff' : '#128C7E'}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.circleBtn, isSpeakerOn && styles.activeBtn]}
                        onPress={() => setIsSpeakerOn(!isSpeakerOn)}
                    >
                        <MaterialCommunityIcons
                            name={isSpeakerOn ? 'volume-high' : 'volume-low'}
                            size={28}
                            color={isSpeakerOn ? '#fff' : '#128C7E'}
                        />
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
        backgroundColor: '#0b141a',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 50,
    },
    topSection: {
        alignItems: 'center',
        marginTop: 60,
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 65,
        borderWidth: 2,
        borderColor: '#128C7E',
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    callingText: {
        fontSize: 16,
        color: '#ccc',
        marginTop: 6,
    },
    controlsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        paddingHorizontal: 40,
        marginBottom: 20,
    },
    circleBtn: {
        backgroundColor: '#f0f0f0',
        width: 65,
        height: 65,
        borderRadius: 32.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeBtn: {
        backgroundColor: '#128C7E',
    },
    endCall: {
        backgroundColor: 'red',
    },
});
