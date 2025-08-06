import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {
    moderateScale,
    scale,
    verticalScale,
} from "react-native-size-matters";

const Profile = () => {
    const { name = "Unknown", avatar = "" } = useLocalSearchParams<{
        name: string;
        avatar: string;
    }>();

    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(name);
    const router = useRouter();

    const handleSave = () => {
        setIsEditing(false);
        Alert.alert("Saved", `Name updated to: ${editedName}`);
        // Backend update logic can be added here if needed
    };

    const handleSearchNavigate = () => {
        router.push({
            pathname: "/Screen/SearchChat",
            params: { name: editedName, avatar },
        });
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Contact Info</Text>
                <TouchableOpacity
                    onPress={() =>
                        isEditing ? handleSave() : setIsEditing(true)
                    }
                >
                    <Text style={styles.editText}>
                        {isEditing ? "Save" : "Edit"}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Avatar */}
            <Image source={{ uri: avatar }} style={styles.avatar} />

            {/* Name Input or Display */}
            {isEditing ? (
                <TextInput
                    style={styles.nameInput}
                    value={editedName}
                    onChangeText={setEditedName}
                    placeholder="Enter name"
                />
            ) : (
                <Text style={styles.nameText}>{editedName}</Text>
            )}

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() =>
                        router.push({
                            pathname: "/Screen/VoiceCall",
                            params: { name: editedName, avatar },
                        })
                    }
                >
                    <Ionicons name="call" size={24} color="#128C7E" />
                    <Text style={styles.buttonText}>Audio</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() =>
                        router.push({
                            pathname: "/Screen/VideoCall",
                            params: { name: editedName, avatar },
                        })
                    }
                >
                    <Ionicons name="videocam" size={24} color="#128C7E" />
                    <Text style={styles.buttonText}>Video</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() =>
                        router.push({
                            pathname: "/Screen/Chats",
                            params: { search: "true" },
                        })
                    }
                >
                    <Ionicons name="search" size={24} color="#128C7E" />
                    <Text style={styles.buttonText}>Search</Text>
                </TouchableOpacity>

            </View>

            {/* Status */}
            <View style={styles.statusBox}>
                <Text style={styles.statusText}>Not available 🚫</Text>
                <Text style={styles.statusDate}>Sep 5, 2018</Text>
            </View>
        </View>
    );
};

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        paddingTop: verticalScale(70),
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: scale(15),
        marginBottom: verticalScale(20),
    },
    headerTitle: {
        fontSize: moderateScale(16),
        fontWeight: "600",
        color: "#000",
    },
    editText: {
        fontSize: moderateScale(14),
        color: "#007AFF",
        fontWeight: "500",
    },
    avatar: {
        width: scale(100),
        height: scale(100),
        borderRadius: scale(50),
        marginBottom: verticalScale(10),
    },
    nameText: {
        fontSize: moderateScale(18),
        fontWeight: "600",
        marginBottom: verticalScale(20),
    },
    nameInput: {
        fontSize: moderateScale(16),
        borderBottomWidth: 1,
        borderColor: "#ccc",
        width: "60%",
        textAlign: "center",
        marginBottom: verticalScale(20),
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        paddingHorizontal: scale(30),
        marginBottom: verticalScale(25),
    },
    actionButton: {
        alignItems: "center",
    },
    buttonText: {
        fontSize: moderateScale(12),
        marginTop: verticalScale(5),
        color: "#128C7E",
    },
    statusBox: {
        backgroundColor: "#f2f2f2",
        padding: scale(15),
        borderRadius: 10,
        width: "90%",
        alignItems: "center",
    },
    statusText: {
        fontSize: moderateScale(14),
        marginBottom: verticalScale(4),
    },
    statusDate: {
        fontSize: moderateScale(12),
        color: "#888",
    },
});
