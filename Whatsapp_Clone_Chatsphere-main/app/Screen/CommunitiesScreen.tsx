import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
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

const initialCommunities = [
  {
    id: "1",
    name: "Tech Enthusiasts",
    members: 120,
    recent: "New meetup scheduled!",
    unread: 3,
    avatar: "https://cdn-icons-png.flaticon.com/512/3595/3595455.png",
  },
  {
    id: "2",
    name: "Designers Hub",
    members: 80,
    recent: "Logo review tonight 🎨",
    unread: 1,
    avatar: "https://cdn-icons-png.flaticon.com/512/4326/4326001.png",
  },
  {
    id: "3",
    name: "Fitness Squad",
    members: 45,
    recent: "Morning yoga at 6am",
    unread: 0,
    avatar: "https://cdn-icons-png.flaticon.com/512/3198/3198701.png",
  },
  {
    id: "4",
    name: "Gaming Arena",
    members: 200,
    recent: "PUBG room open!",
    avatar: "https://cdn-icons-png.flaticon.com/512/2936/2936885.png",
  },
  {
    id: "5",
    name: "Movie Lovers",
    members: 65,
    recent: "New trailer drop 🍿",
    avatar: "https://cdn-icons-png.flaticon.com/512/2922/2922676.png",
  },
  {
    id: "6",
    name: "Crypto Champs",
    members: 300,
    recent: "BTC to the moon 🌙",
    avatar: "https://cdn-icons-png.flaticon.com/512/5548/5548282.png",
  },
  {
    id: "7",
    name: "College Friends",
    members: 35,
    recent: "Trip planning again",
    avatar: "https://cdn-icons-png.flaticon.com/512/1077/1077012.png",
  },
];

const CommunityScreen = () => {
  const [search, setSearch] = useState("");
  const [communities, setCommunities] = useState(initialCommunities);
  const [modalVisible, setModalVisible] = useState(false);

  const [newName, setNewName] = useState("");
  const [newAvatar, setNewAvatar] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const filteredCommunities = communities.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const openImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Camera roll access is needed.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      quality: 0.5,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setNewAvatar(result.assets[0].uri);
    }
  };

  const handleCreateCommunity = () => {
    if (!newName.trim()) {
      setError("Community name is required.");
      return;
    }

    if (!newAvatar) {
      setError("Please select an avatar image.");
      return;
    }

    const newCommunity = {
      id: Date.now().toString(),
      name: newName.trim(),
      members: 1,
      recent: "Welcome to the community!",
      unread: 0,
      avatar: newAvatar,
    };

    setCommunities([newCommunity, ...communities]);
    setModalVisible(false);
    setNewName("");
    setNewAvatar(null);
    setError("");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Communities</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={24} color="#05AA82" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#999" style={{ marginRight: 10 }} />
        <TextInput
          placeholder="Search community..."
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Community List */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredCommunities.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/Screen/CommunityChatScreen",
                params: {
                  id: item.id,
                  name: item.name,
                  avatar: item.avatar,
                  isAdmin: "true",
                },
              })
            }
          >
            <View>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              {item.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unread}</Text>
                </View>
              )}
            </View>
            <View style={styles.details}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>{item.members} members</Text>
              <Text style={styles.recent} numberOfLines={1}>
                {item.recent}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Create New Community</Text>

            <TextInput
              placeholder="Community Name"
              value={newName}
              onChangeText={(text) => {
                setNewName(text);
                setError("");
              }}
              style={styles.modalInput}
            />

            <TouchableOpacity style={styles.imagePicker} onPress={openImagePicker}>
              {newAvatar ? (
                <Image source={{ uri: newAvatar }} style={styles.previewAvatar} />
              ) : (
                <Text style={{ color: "#666" }}>Pick an avatar</Text>
              )}
            </TouchableOpacity>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#ccc" }]}
                onPress={() => {
                  setModalVisible(false);
                  setError("");
                  setNewName("");
                  setNewAvatar(null);
                }}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtn} onPress={handleCreateCommunity}>
                <Text style={{ color: "#fff" }}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CommunityScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: verticalScale(20) },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: scale(15),
    alignItems: "center",
    marginBottom: verticalScale(10),
    marginTop: moderateScale(30),
  },
  title: {
    fontSize: moderateScale(28),
    fontWeight: "bold",
    color: "#05AA82",
  },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#f1f1f1",
    marginHorizontal: scale(15),
    padding: scale(10),
    borderRadius: scale(25),
    alignItems: "center",
    marginBottom: verticalScale(10),
  },
  searchInput: { flex: 1, fontSize: moderateScale(13) },
  scrollContent: {
    paddingHorizontal: scale(15),
    paddingBottom: verticalScale(100),
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(15),
    backgroundColor: "#f9f9f9",
    borderRadius: scale(15),
    padding: scale(10),
    elevation: 1,
  },
  avatar: {
    width: scale(55),
    height: scale(55),
    borderRadius: scale(27),
    marginRight: scale(12),
  },
  unreadBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  unreadText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: moderateScale(15),
    fontWeight: "bold",
    color: "#333",
  },
  meta: {
    fontSize: moderateScale(11),
    color: "#666",
    marginVertical: verticalScale(2),
  },
  recent: {
    fontSize: moderateScale(12),
    color: "#999",
  },
  noResults: {
    textAlign: "center",
    color: "#aaa",
    fontSize: moderateScale(14),
    marginTop: verticalScale(20),
  },
  fab: {
    position: "absolute",
    bottom: verticalScale(130),
    right: scale(20),
    backgroundColor: "#05AA82",
    width: scale(55),
    height: scale(55),
    borderRadius: scale(27.5),
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000066",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 120,
    marginBottom: 10,
  },
  previewAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginBottom: 5,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  modalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#05AA82",
    marginLeft: 10,
  },
});
