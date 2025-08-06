import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const dummyMembers = [
    { id: "1", name: "Admin (You)" },
    { id: "2", name: "Ali" },
    { id: "3", name: "Sara" },
    { id: "4", name: "Noman" },
];

export default function CommunityDetailsScreen() {
    const { name = "Community", avatar } = useLocalSearchParams<{ name: string; avatar: string }>();
    const router = useRouter();

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.container}>


                {/* Custom Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Community Details</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Avatar & Name */}
                    <View style={styles.avatarSection}>
                        <Image source={{ uri: avatar }} style={styles.avatar} />
                        <Text style={styles.name}>{name}</Text>
                    </View>

                    {/* About Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About</Text>
                        <Text style={styles.aboutText}>
                            This is a private community for discussion and sharing updates among members.
                        </Text>
                    </View>

                    {/* Members Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Members ({dummyMembers.length})</Text>
                        {dummyMembers.map((m) => (
                            <View key={m.id} style={styles.memberRow}>
                                <Ionicons name="person-circle-outline" size={20} color="#05AA82" />
                                <Text style={styles.member}>{m.name}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Actions Section */}
                    <View style={styles.section}>
                        <TouchableOpacity style={styles.leaveButton}>
                            <Text style={styles.leaveText}>Leave Community</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

    // Header Style
    header: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#05AA82",
        paddingTop: verticalScale(40),
        paddingBottom: verticalScale(12),
        paddingHorizontal: scale(16),
        elevation: 5,
    },
    backButton: {
        marginRight: scale(10),
    },
    headerTitle: {
        fontSize: moderateScale(20),
        fontWeight: "bold",
        color: "#fff",
    },

    scrollContent: {
        padding: scale(20),
    },

    avatarSection: {
        alignItems: "center",
        marginBottom: verticalScale(25),
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: verticalScale(10),
        borderWidth: 2,
        borderColor: "#05AA82",
    },
    name: {
        fontSize: moderateScale(20),
        fontWeight: "bold",
        color: "#333",
    },

    section: {
        marginBottom: verticalScale(25),
    },
    sectionTitle: {
        fontSize: moderateScale(16),
        fontWeight: "bold",
        color: "#444",
        marginBottom: verticalScale(8),
    },
    aboutText: {
        fontSize: moderateScale(14),
        color: "#666",
        lineHeight: 20,
    },

    memberRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    member: {
        fontSize: moderateScale(14),
        marginLeft: scale(8),
        color: "#222",
    },

    leaveButton: {
        backgroundColor: "#F44336",
        paddingVertical: scale(12),
        borderRadius: 8,
    },
    leaveText: {
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: moderateScale(14),
    },
});
