// UpdatesScreen.tsx

import { Ionicons } from "@expo/vector-icons";
import { Video } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const chatAvatars = {
  Ayesha: "https://wallpapers.com/images/hd/pretty-snow-white-n9otqz6ijd2ze1mo.jpg",
  Anees: "https://i.ibb.co/CK1J1Jjh/IMG-20250408-WA0024.jpg",
  Fatima: "https://i.pinimg.com/736x/72/9c/9d/729c9de0a72d86ec4490de02099ea827.jpg",
  Usman: "https://randomuser.me/api/portraits/men/7.jpg",
};

const unseenStatus = [
  {
    id: "1",
    name: "Ayesha",
    time: "Just now",
    avatar: chatAvatars.Ayesha,
    media: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "2",
    name: "Anees",
    time: "5 mins ago",
    avatar: chatAvatars.Anees,
    media: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
  },
];

const seenStatus = [
  {
    id: "3",
    name: "Fatima",
    time: "Today, 9:00 AM",
    avatar: chatAvatars.Fatima,
    media: "https://filesamples.com/samples/video/mp4/sample_640x360.mp4",
  },
  {
    id: "4",
    name: "Usman",
    time: "Yesterday",
    avatar: chatAvatars.Usman,
    media: "https://placekitten.com/603/603",
  },
];

const UpdatesScreen = () => {
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerMedia, setViewerMedia] = useState(null);
  const [viewerName, setViewerName] = useState("");
  const [viewerAvatar, setViewerAvatar] = useState("");
  const progress = useRef(new Animated.Value(0)).current;

  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [myStatus, setMyStatus] = useState(null);

  const openViewer = (mediaUri, name, avatar) => {
    setViewerMedia(mediaUri);
    setViewerName(name);
    setViewerAvatar(avatar);
    setViewerVisible(true);
  };

  const handleAddStatus = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "We need access to your gallery.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedAsset = result.assets[0];
      setMyStatus({
        uri: selectedAsset.uri,
        type: selectedAsset.type,
      });
    }
  };

  useEffect(() => {
    if (viewerVisible) {
      const animation = Animated.timing(progress, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: false,
      }).start(() => {
        setViewerVisible(false);
        progress.setValue(0);
      });

      return () => progress.stopAnimation();
    }
  }, [viewerVisible]);

  const widthInterpolated = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const isVideo = (uri) =>
    uri?.endsWith(".mp4") || uri?.includes("video") || uri?.includes(".mov");

  const filteredUnseen = unseenStatus.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredSeen = seenStatus.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {!searchVisible ? (
          <>
            <Text style={styles.headerTitle}>Updates</Text>
            <TouchableOpacity onPress={() => setSearchVisible(true)}>
              <Ionicons name="search" size={24} color="#000" />
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#888" style={{ marginRight: 6 }} />
            <TextInput
              placeholder="Search status..."
              style={styles.searchInput}
              placeholderTextColor="#aaa"
              value={searchTerm}
              onChangeText={setSearchTerm}
              autoFocus
            />
            <TouchableOpacity
              onPress={() => {
                setSearchTerm("");
                setSearchVisible(false);
              }}
            >
              <Ionicons name="close" size={22} color="#000" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Status List */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* My Status */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Status</Text>
        </View>

        <View style={styles.myStatusContainer}>
          <TouchableOpacity
            style={styles.myStatusInner}
            onPress={() => {
              if (myStatus) {
                openViewer(myStatus.uri, "My Status", "https://cdn-icons-png.flaticon.com/512/149/149071.png");
              } else {
                handleAddStatus();
              }
            }}
          >
            <View style={styles.myAvatarWrapper}>
              {myStatus ? (
                isVideo(myStatus.uri) ? (
                  <Ionicons name="play-circle" size={55} color="#05AA82" />
                ) : (
                  <Image source={{ uri: myStatus.uri }} style={styles.myAvatar} />
                )
              ) : (
                <Image
                  source={{ uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png" }}
                  style={styles.myAvatar}
                />
              )}

              {/* Only show '+' icon if no status */}
              {!myStatus && (
                <View style={styles.addIcon}>
                  <Ionicons name="add" size={16} color="#fff" />
                </View>
              )}
            </View>
            <View>
              <Text style={styles.name}>My Status</Text>
              <Text style={styles.time}>
                {myStatus ? "Tap to view your status" : "Tap to add status"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Unseen */}
        <View style={styles.statusBlock}>
          <Text style={styles.statusLabel}>Recent Updates</Text>
          {filteredUnseen.map((status) => (
            <TouchableOpacity
              key={status.id}
              style={styles.statusItem}
              onPress={() => openViewer(status.media, status.name, status.avatar)}
            >
              <Image source={{ uri: status.avatar }} style={styles.avatar} />
              <View>
                <Text style={styles.name}>{status.name}</Text>
                <Text style={styles.time}>{status.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Seen */}
        <View style={styles.statusBlock}>
          <Text style={styles.statusLabel}>Viewed Updates</Text>
          {filteredSeen.map((status) => (
            <TouchableOpacity
              key={status.id}
              style={styles.statusItem}
              onPress={() => openViewer(status.media, status.name, status.avatar)}
            >
              <Image source={{ uri: status.avatar }} style={styles.avatarSeen} />
              <View>
                <Text style={styles.name}>{status.name}</Text>
                <Text style={styles.time}>{status.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddStatus}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Modal Viewer */}
      <Modal visible={viewerVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.viewerHeader}>
            <Image source={{ uri: viewerAvatar }} style={styles.viewerAvatar} />
            <Text style={styles.viewerName}>{viewerName}</Text>
          </View>
          <View style={styles.storyProgressWrapper}>
            <Animated.View style={[styles.storyProgressBar, { width: widthInterpolated }]} />
          </View>
          {viewerMedia &&
            (isVideo(viewerMedia) ? (
              <Video
                source={{ uri: viewerMedia }}
                style={styles.fullVideo}
                shouldPlay
                resizeMode="contain"
                useNativeControls
                onPlaybackStatusUpdate={(status) => {
                  if (status.didJustFinish) {
                    setViewerVisible(false);
                    progress.setValue(0);
                  }
                }}
              />
            ) : (
              <Image source={{ uri: viewerMedia }} style={styles.fullVideo} />
            ))}
        </View>
      </Modal>
    </View>
  );
};

export default UpdatesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { paddingBottom: verticalScale(100) },
  header: {
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(15),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    marginTop: moderateScale(30),
  },
  headerTitle: { fontSize: moderateScale(24), fontWeight: "bold", color: "#05AA82" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 6,
    elevation: 2,
    flex: 1,
    marginLeft: scale(5),
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 15,
    color: "#333",
  },
  sectionHeader: {
    paddingHorizontal: scale(15),
    marginTop: verticalScale(10),
    marginBottom: verticalScale(5),
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "#333",
  },
  myStatusContainer: {
    paddingHorizontal: scale(15),
    marginBottom: verticalScale(10),
  },
  myStatusInner: { flexDirection: "row", alignItems: "center" },
  myAvatarWrapper: { position: "relative", marginRight: scale(12) },
  myAvatar: { width: scale(55), height: scale(55), borderRadius: scale(28) },
  addIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#05AA82",
    borderRadius: 10,
    padding: 2,
    borderWidth: 2,
    borderColor: "#fff",
  },
  statusBlock: {
    paddingHorizontal: scale(15),
    marginBottom: verticalScale(10),
  },
  statusLabel: {
    fontSize: moderateScale(14),
    fontWeight: "600",
    marginBottom: verticalScale(8),
    color: "#888",
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(12),
  },
  avatar: {
    width: scale(55),
    height: scale(55),
    borderRadius: scale(28),
    borderWidth: 2,
    borderColor: "#05AA82",
    marginRight: scale(12),
  },
  avatarSeen: {
    width: scale(55),
    height: scale(55),
    borderRadius: scale(28),
    borderWidth: 2,
    borderColor: "#ccc",
    marginRight: scale(12),
  },
  name: {
    fontSize: moderateScale(14),
    fontWeight: "bold",
    color: "#000",
  },
  time: {
    fontSize: moderateScale(12),
    color: "#888",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  fullVideo: {
    width: screenWidth,
    height: screenHeight,
    resizeMode: "contain",
  },
  storyProgressWrapper: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    height: 4,
    backgroundColor: "#ddd",
    borderRadius: 4,
    overflow: "hidden",
  },
  storyProgressBar: {
    height: 4,
    backgroundColor: "#05AA82",
  },
  viewerHeader: {
    position: "absolute",
    top: 10,
    left: 15,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 2,
  },
  viewerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },
  viewerName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#fff",
  },
  fab: {
    position: "absolute",
    bottom: 120,
    right: 20,
    backgroundColor: "#05AA82",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
