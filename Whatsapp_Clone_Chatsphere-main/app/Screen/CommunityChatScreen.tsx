import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Alert,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {
    moderateScale,
    scale,
    verticalScale,
} from "react-native-size-matters";

export default function CommunityChatScreen() {
    const router = useRouter();
    const flatListRef = useRef<FlatList>(null);

    const { id, name = "Community", avatar, isAdmin = "false" } =
        useLocalSearchParams<{
            id: string;
            name: string;
            avatar: string;
            isAdmin: string;
        }>();

    const [messages, setMessages] = useState([
        { id: "1", text: `Welcome to ${name}!`, sender: "admin" },
    ]);
    const [input, setInput] = useState("");

    const sendMessage = () => {
        if (isAdmin !== "true") {
            Alert.alert("Permission denied", "Only admins can send messages.");
            return;
        }

        if (!input.trim()) return;

        setMessages((prev) => [
            ...prev,
            { id: Date.now().toString(), text: input.trim(), sender: "admin" },
        ]);
        setInput("");
    };

    useEffect(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={styles.safeArea}>

                <View style={{ flex: 1 }}>
                    <KeyboardAvoidingView
                        style={styles.container}
                        behavior={Platform.OS === "ios" ? "padding" : undefined}
                        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 30}
                    >
                        {/* Custom Header */}
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => router.back()}>
                                <Ionicons name="arrow-back" size={24} color="#fff" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() =>
                                    router.push({
                                        pathname: "/Screen/CommunityDetailsScreen",
                                        params: { id, name, avatar },
                                    })
                                }
                                style={styles.headerCenter}
                            >
                                <Image source={{ uri: avatar }} style={styles.avatar} />
                                <Text style={styles.title}>{name}</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Chat Messages */}
                        <FlatList
                            ref={flatListRef}
                            data={messages}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View
                                    style={[
                                        styles.messageBubble,
                                        item.sender === "admin"
                                            ? styles.myMsg
                                            : styles.otherMsg,
                                    ]}
                                >
                                    <Text style={styles.msgText}>{item.text}</Text>
                                </View>
                            )}
                            contentContainerStyle={styles.chatContainer}
                            onContentSizeChange={() =>
                                flatListRef.current?.scrollToEnd({ animated: true })
                            }
                        />

                        {/* Input Field */}
                        <View style={styles.inputRow}>
                            <TextInput
                                placeholder="Only admin can send message"
                                value={input}
                                onChangeText={setInput}
                                editable={isAdmin === "true"}
                                style={[
                                    styles.input,
                                    isAdmin !== "true" && { backgroundColor: "#eee" },
                                ]}
                            />
                            <TouchableOpacity
                                onPress={sendMessage}
                                style={[
                                    styles.sendBtn,
                                    !input.trim() && { opacity: 0.5 },
                                ]}
                                disabled={!input.trim()}
                            >
                                <Ionicons name="send" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container: {
        flex: 1,
        backgroundColor: "#f4f4f4",
    },

    header: {
        backgroundColor: "#05AA82",
        paddingTop: moderateScale(40),
        paddingBottom: verticalScale(14),
        paddingHorizontal: scale(15),
        flexDirection: "row",
        alignItems: "center",
        gap: scale(12),
        borderBottomWidth: 0.5,
        borderBottomColor: "#03765e",
    },
    headerCenter: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        width: scale(36),
        height: scale(36),
        borderRadius: 18,
        marginRight: scale(8),
        borderWidth: 1,
        borderColor: "#fff",
    },
    title: {
        fontSize: moderateScale(17),
        fontWeight: "bold",
        color: "#fff",
    },

    chatContainer: {
        padding: scale(10),
        paddingBottom: verticalScale(100),
    },
    messageBubble: {
        maxWidth: "75%",
        padding: scale(10),
        marginVertical: verticalScale(5),
        borderRadius: 16,
    },
    myMsg: {
        backgroundColor: "#dcf8c6",
        alignSelf: "flex-end",
        borderTopRightRadius: 0,
    },
    otherMsg: {
        backgroundColor: "#fff",
        alignSelf: "flex-start",
        borderTopLeftRadius: 0,
    },
    msgText: {
        color: "#000",
        fontSize: moderateScale(14),
    },

    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(10),
        borderTopWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#fff",
        marginBottom: 50,
    },
    input: {
        flex: 1,
        padding: scale(10),
        borderRadius: 25,
        borderWidth: 1,
        borderColor: "#ccc",
        marginRight: scale(10),
        fontSize: moderateScale(13),
        backgroundColor: "#fff",
    },
    sendBtn: {
        backgroundColor: "#05AA82",
        borderRadius: 25,
        padding: scale(10),
    },
});
