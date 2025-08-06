import { Ionicons } from "@expo/vector-icons";
import * as Audio from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as Linking from "expo-linking";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Modal, Pressable } from "react-native";

import {
    Dimensions,
    FlatList,
    Image,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import EmojiSelector from "react-native-emoji-selector";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    moderateScale,
    scale,
    verticalScale,
} from "react-native-size-matters";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const ActionBar = ({ onPin, onDelete, onClose }) => (
    <View style={styles.actionBar}>
        <TouchableOpacity style={styles.actionButton} onPress={onPin}>
            <Ionicons name="pin-outline" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
            <Ionicons name="trash-outline" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onClose}>
            <Ionicons name="close-outline" size={22} color="#fff" />
        </TouchableOpacity>
    </View>
);

type Message = {
    id: string;
    text: string;
    time: string;
    sender: "me" | "other";
    status?: string;
    pinned?: boolean;
    replyTo?: string;
};



const ChatScreen = () => {
    const { name = "Unknown", avatar, search } = useLocalSearchParams<{
        name: string;
        avatar: string;
        search?: string;
    }>();

    const isSearching = search === "true";
    const [searchQuery, setSearchQuery] = useState("");

    const router = useRouter();

    const [messages, setMessages] = useState<Message[]>([
        { id: "1", text: "Hi!", time: "11:30 AM", sender: "other" },
        {
            id: "2",
            text: "Hello! Kya haal hai?",
            time: "11:31 AM",
            sender: "me",
            status: "sent",
        },
        {
            id: "3",
            text: "Sab theek, tum sunao?",
            time: "11:32 AM",
            sender: "other",
        },
    ]);

    const [input, setInput] = useState("");
    const [replyMessage, setReplyMessage] = useState<Message | null>(null);
    const [typing, setTyping] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const [recording, setRecording] = useState<Audio.Audio.Recording | null>(
        null
    );
    const [showEmojis, setShowEmojis] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState<number>(0);
    const [imagePreviewUri, setImagePreviewUri] = useState<string | null>(null);
    const [selectedMessages, setSelectedMessages] = useState<string[]>([]);

    const [pinnedMessage, setPinnedMessage] = useState<Message | null>(null);

    const durationInterval = useRef<NodeJS.Timer | null>(null);
    const [showImageOptions, setShowImageOptions] = useState(false);
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    const sendMessage = (text = "") => {
        const finalText = text || input;
        if (!finalText.trim()) return;
        const newMsg: Message = {
            id: Date.now().toString(),
            text: finalText,
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
            sender: "me",
            status: "sent",
            replyTo: replyMessage?.text,
        };
        setMessages((prev) => [...prev, newMsg]);
        setInput("");
        setReplyMessage(null);
        scrollToBottom();
        simulateReply();
    };
    const sendImageMessage = (uri: string) => {
        const newMsg: Message = {
            id: Date.now().toString(),
            text: uri,
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
            sender: "me",
            status: "sent",
        };
        setMessages((prev) => [...prev, newMsg]);
        scrollToBottom();
        simulateReply();
    };
    const simulateReply = () => {
        setTyping(true);
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    text: "Okay great!",
                    time: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                    sender: "other",
                },
            ]);
            scrollToBottom();
            setTyping(false);
        }, 1500);
    };

    const scrollToBottom = () => {
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    };
    const handleLongPress = (item: Message) => {
        if (selectedMessages.includes(item.id)) {
            setSelectedMessages(prev => prev.filter(id => id !== item.id));
        } else {
            setSelectedMessages(prev => [...prev, item.id]);
        }
    };
    const handleCameraLaunch = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) return;

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.7,
            base64: false,
        });

        if (!result.canceled && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            sendImageMessage(uri);
        }
    };
    const handleGalleryPick = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        });

        if (!result.canceled && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            sendImageMessage(uri);
        }
    };


    const handleRecordStart = async () => {
        const { granted } = await Audio.Audio.requestPermissionsAsync();
        if (!granted) return;
        await Audio.Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
        });
        const { recording } = await Audio.Audio.Recording.createAsync(
            Audio.Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
        setRecordingDuration(0);
        durationInterval.current = setInterval(
            () => setRecordingDuration((prev) => prev + 1),
            1000
        );
    };

    const handleRecordStop = async () => {
        try {
            if (!recording) return;
            await recording.stopAndUnloadAsync();
            clearInterval(durationInterval.current!);
            const uri = recording.getURI();
            if (!uri) return;
            sendMessage(`[🎤 Voice Message - ${recordingDuration}s] ${uri}`);
            setRecording(null);
            setRecordingDuration(0);
        } catch (e) {
            console.log("Stop recording error", e);
        }
    };
    const handleDocumentPick = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "*/*",
                copyToCacheDirectory: true,
            });

            if (result.type === "success" && result.assets && result.assets[0]) {
                const { uri, name, size } = result.assets[0];

                const newMsg: Message = {
                    id: Date.now().toString(),
                    text: JSON.stringify({ name, uri, size }),
                    time: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                    sender: "me",
                    status: "sent",
                };

                setMessages((prev) => [...prev, newMsg]);
                simulateReply();
            }
        } catch (error) {
            console.error("Document pick error:", error);
        }
    };

    const renderItem = ({ item }: { item: Message }) => {
        const isMe = item.sender === "me";
        const isImage = item.text.startsWith("file://") || item.text.startsWith("data:");
        const isSelected = selectedMessages.includes(item.id);
        const isPinned = item.pinned;

        const isDocument = (() => {
            try {
                const parsed = JSON.parse(item.text);
                return parsed?.uri && parsed?.name;
            } catch {
                return false;
            }
        })();
        const renderReply = item.replyTo ? (
            <Text style={{ fontSize: 11, fontStyle: "italic", color: "#555" }}>↪ {item.replyTo}</Text>
        ) : null;
        const swipeRight = () => (
            <TouchableOpacity style={{ justifyContent: "center", padding: 10 }} onPress={() => setReplyMessage(item)}>
                <Ionicons name="arrow-undo" size={22} color="#555" />
            </TouchableOpacity>
        );

        const getIconForFile = (filename: string) => {
            const ext = filename.split(".").pop()?.toLowerCase();
            switch (ext) {
                case "pdf":
                    return "document-text";
                case "doc":
                case "docx":
                    return "document";
                case "xls":
                case "xlsx":
                    return "document-attach";
                case "txt":
                    return "document-outline";
                default:
                    return "document";
            }
        };

        const openDocument = () => {
            try {
                const { uri } = JSON.parse(item.text);
                Linking.openURL(uri);
            } catch (e) {
                console.error("Cannot open document:", e);
            }
        };

        return (

            <TouchableOpacity onLongPress={() => handleLongPress(item)} onPress={() => isImage ? setImagePreviewUri(item.text) : isDocument && openDocument()}>
                <View
                    style={[
                        styles.messageContainer2,
                        isMe ? styles.messageRight : styles.messageLeft,
                        isSelected && { backgroundColor: "#d0ebff" },
                    ]}
                >
                    {isImage ? (
                        <Image source={{ uri: item.text }} style={styles.imageMessage} resizeMode="cover" />
                    ) : isDocument ? (
                        (() => {
                            const { name, size } = JSON.parse(item.text);
                            return (
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                    <Ionicons name={getIconForFile(name)} size={22} color="#555" />
                                    <View>
                                        <Text style={styles.messageText}>{name}</Text>
                                        <Text style={{ fontSize: 10, color: "#888" }}>
                                            {(size / 1024).toFixed(1)} KB
                                        </Text>
                                    </View>
                                </View>
                            );
                        })()
                    ) : (
                        <Text style={styles.messageText}>{item.text}</Text>
                    )}

                    <View style={styles.messageMeta}>
                        <Text style={styles.messageTime}>{item.time}</Text>
                        {isMe && <Ionicons name="checkmark-done" size={10} color="#4caf50" />}
                    </View>
                </View>
            </TouchableOpacity>


        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} edges={["top", "bottom"]}>
            <Stack.Screen options={{ headerShown: false }} />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 7}
            >


                <View style={styles.header}>
                    {pinnedMessage && (
                        <View style={styles.pinnedBar}>
                            <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                                <Ionicons name="pin" size={16} color="#555" style={{ marginRight: 6 }} />
                                <Text
                                    numberOfLines={1}
                                    style={{ flex: 1, fontSize: 13, color: "#333" }}
                                >
                                    {pinnedMessage.text.startsWith("file://") ? "📷 Image" : pinnedMessage.text}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => setPinnedMessage(null)}>
                                <Ionicons name="close" size={20} color="#555" />
                            </TouchableOpacity>
                        </View>
                    )}
                    {isSearching ? (
                        <View style={styles.searchBar}>
                            <TextInput
                                placeholder="Search messages..."
                                style={styles.searchInput2}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                autoFocus
                            />
                            <TouchableOpacity
                                onPress={() => {

                                    setSearchQuery("");
                                }}
                            >
                                <Ionicons name="close" size={22} color="#000" />
                            </TouchableOpacity>

                        </View>
                    ) : (
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => router.back()}>
                                <Ionicons name="arrow-back" size={24} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    router.push({ pathname: "/Screen/Profile", params: { name, avatar } });
                                }}
                                style={{ flexDirection: "row", alignItems: "center" }}
                            >
                                <Image source={{ uri: avatar }} style={styles.headerAvatar} />
                                <View>
                                    <Text style={styles.headerName}>{name}</Text>
                                    <Text style={styles.headerSubtitle}>Last seen today at 09:06</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.headerIcon} onPress={() => router.push({ pathname: "/Screen/VideoCall", params: { name, avatar } })}>
                                <Ionicons name="videocam" size={22} color="black" />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.headerIcon2} onPress={() => router.push({ pathname: "/Screen/VoiceCall", params: { name, avatar } })}>
                                <Ionicons name="call" size={20} color="black" />
                            </TouchableOpacity>
                        </View>
                    )}


                </View>
                <View style={{ flex: 1, backgroundColor: "#e5ddd5" }}>
                    {selectedMessages.length > 0 && (
                        <ActionBar
                            onPin={() => {
                                setMessages(prev =>
                                    prev.map(msg =>
                                        selectedMessages.includes(msg.id)
                                            ? { ...msg, pinned: !msg.pinned }
                                            : msg
                                    )
                                );
                                setSelectedMessages([]);
                            }}
                            onDelete={() => {
                                setMessages((prev) => prev.filter((m) => !selectedMessages.includes(m.id)));
                                setSelectedMessages([]);
                            }}
                            onClose={() => setSelectedMessages([])}
                        />
                    )}
                    <FlatList
                        ref={flatListRef}
                        data={(isSearching
                            ? messages.filter((m) =>
                                m.text.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            : messages
                        ).sort((a, b) => {

                            if (a.pinned && !b.pinned) return -1;
                            if (!a.pinned && b.pinned) return 1;
                            return 0;
                        })}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.messageList}

                    />
                    {typing && (
                        <Text style={{ margin: 10, color: '#888' }}>{name} is typing...</Text>
                    )}
                    {replyMessage && (
                        <View style={{ padding: 8, backgroundColor: '#e0e0e0' }}>
                            <Text style={{ fontSize: 12 }}>Replying to: {replyMessage.text}</Text>
                            <TouchableOpacity onPress={() => setReplyMessage(null)}>
                                <Ionicons name="close" size={18} color="#333" />
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Emoji Selector */}
                    {showEmojis && (
                        <View style={{ height: verticalScale(280) }}>
                            <EmojiSelector
                                onEmojiSelected={(emoji) => setInput((prev) => prev + emoji)}
                                showSearchBar={false}
                                columns={9}
                                showTabs
                                showSectionTitles
                            />
                        </View>
                    )}

                    {recording && (
                        <View style={styles.voiceRecordingBox}>
                            <LottieView
                                source={{
                                    uri: "https://assets5.lottiefiles.com/packages/lf20_qp1q7mct.json",
                                }}
                                autoPlay
                                loop
                                style={styles.wave}
                            />
                            <Text style={styles.recordingText}>
                                Recording... {String(recordingDuration).padStart(2, "0")}s
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.chatBarContainer}>
                    <View style={styles.chatBar}>
                        <TouchableOpacity onPress={() => setShowEmojis(!showEmojis)}>
                            <Ionicons name="happy-outline" size={22} color="#555" />
                        </TouchableOpacity>
                        <TextInput
                            placeholder="Message"
                            style={styles.chatInput}
                            value={input}
                            onChangeText={setInput}
                            onFocus={() => setShowEmojis(false)}
                        />
                        <TouchableOpacity onPress={handleDocumentPick}>
                            <Ionicons name="attach" size={30} color="#555" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShowImageOptions(true)}>
                            <Ionicons name="camera" size={22} color="#555" />
                        </TouchableOpacity>
                    </View>

                    {input.trim() ? (
                        <TouchableOpacity style={styles.micButton} onPress={() => sendMessage()}>
                            <Ionicons name="send" size={22} color="#fff" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={styles.micButton}
                            onPressIn={handleRecordStart}
                            onPressOut={handleRecordStop}
                        >
                            <Ionicons name="mic" size={22} color="#fff" />
                        </TouchableOpacity>
                    )}
                </View>
            </KeyboardAvoidingView>
            <Modal visible={!!imagePreviewUri} transparent>
                <Pressable
                    style={{ flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}
                    onPress={() => setImagePreviewUri(null)}
                >
                    <Image source={{ uri: imagePreviewUri! }} style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, resizeMode: "contain" }} />
                </Pressable>
            </Modal>
            <Modal
                visible={showImageOptions}
                animationType="slide"
                transparent
                onRequestClose={() => setShowImageOptions(false)}
            >
                <Pressable
                    style={{ flex: 1, backgroundColor: "#000000aa", justifyContent: "flex-end" }}
                    onPress={() => setShowImageOptions(false)}
                >
                    <View style={{ backgroundColor: "white", padding: 20, borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
                        <TouchableOpacity
                            style={{ padding: 12 }}
                            onPress={() => {
                                setShowImageOptions(false);
                                handleCameraLaunch();
                            }}
                        >
                            <Text style={{ fontSize: 16 }}>📷 Take Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ padding: 12 }}
                            onPress={() => {
                                setShowImageOptions(false);
                                handleGalleryPick();
                            }}
                        >
                            <Text style={{ fontSize: 16 }}>🖼️ Choose from Gallery</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ padding: 12 }} onPress={() => setShowImageOptions(false)}>
                            <Text style={{ fontSize: 16, color: 'red' }}>❌ Cancel</Text>
                        </TouchableOpacity>

                    </View>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );



};

export default ChatScreen;

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#e5ddd5" },
    container: { flex: 1 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        paddingVertical: verticalScale(5),

    },

    headerAvatar: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(20),
        marginHorizontal: scale(10),
    },

    headerName: {
        fontSize: moderateScale(15),
        fontWeight: "600",
        color: "black",
    },

    headerSubtitle: {
        fontSize: moderateScale(11),
        color: "black",
    },

    headerIcon: {
        marginLeft: scale(80),

    },
    headerIcon2: {
        marginLeft: scale(13),

    },
    pinnedBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderBottomColor: "#ccc",
        borderBottomWidth: 0.5,
    },


    avatar: {
        width: scale(40), height: scale(40), borderRadius: scale(20), marginHorizontal: scale(10),
    },
    name: {
        flex: 1, fontSize: moderateScale(16), fontWeight: "bold", color: "#fff",
    },
    messageList: {
        padding: scale(10), paddingBottom: verticalScale(100), paddingTop: verticalScale(15),
    },
    messageContainer: {
        maxWidth: "75%", padding: scale(10), borderRadius: scale(8), marginVertical: verticalScale(4), backgroundColor: "#fff",
    },
    messageContainer2: {
        maxWidth: "100%", padding: scale(5), borderRadius: scale(8), marginVertical: verticalScale(5), backgroundColor: "#fff",
    },
    messageLeft: { alignSelf: "flex-start" },
    messageRight: { alignSelf: "flex-end", backgroundColor: "#dcf8c6" },
    messageText: { fontSize: moderateScale(13), color: "#000" },
    messageMeta: {
        flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: scale(4),
    },
    messageTime: { fontSize: moderateScale(10), color: "#555", marginTop: verticalScale(2) },
    imageMessage: { width: 250, height: 300, borderRadius: 5, backgroundColor: "#eee" },
    voiceRecordingBox: {
        flexDirection: "row", alignItems: "center", backgroundColor: "#fff", marginHorizontal: scale(10), marginVertical: verticalScale(8), padding: scale(10), borderRadius: scale(12), shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
    },
    wave: { width: 100, height: 50 },
    recordingText: { fontSize: moderateScale(13), marginLeft: scale(12), color: "#333" },
    chatBarContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: scale(3),
        paddingVertical: verticalScale(10),
        paddingBottom: Platform.OS === 'android' ? verticalScale(6) : verticalScale(10),
        backgroundColor: "#e5ddd5",
    },
    chatBar: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 30,
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(11),
        marginRight: scale(10),
        gap: scale(8),
    },
    chatInput: {
        flex: 1,
        fontSize: moderateScale(14),
        paddingVertical: verticalScale(4),
    },
    micButton: {
        backgroundColor: "#25D366",
        width: scale(44),
        height: scale(44),
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
    },
    searchBar: {
        flexDirection: "row",
        backgroundColor: "#f1f1f1",
        margin: scale(10),
        padding: scale(10),
        borderRadius: scale(25),
        alignItems: "center",
    },
    searchInput: {
        flex: 1,
        fontSize: moderateScale(13),
        paddingVertical: verticalScale(2),
    },
    searchInput2: { flex: 1, fontSize: moderateScale(13) },
    actionBar: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "#05AA82",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 0.4,
        borderBottomColor: "#ccc",
        gap: 10,
    },
    actionButton: {
        padding: 10,
        backgroundColor: "#048b6c",
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
    },

});
