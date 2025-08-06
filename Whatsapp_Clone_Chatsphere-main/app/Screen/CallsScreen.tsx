import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as Contacts from "expo-contacts";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const chatAvatars = {
  Ayesha: "https://wallpapers.com/images/hd/pretty-snow-white-n9otqz6ijd2ze1mo.jpg",
  Anees: "https://i.ibb.co/CK1J1Jjh/IMG-20250408-WA0024.jpg",
  Zunair: "https://randomuser.me/api/portraits/women/3.jpg",
  Noman: "https://randomuser.me/api/portraits/men/4.jpg",
  Samar: "https://randomuser.me/api/portraits/women/5.jpg",
  Fatima: "https://i.pinimg.com/736x/72/9c/9d/729c9de0a72d86ec4490de02099ea827.jpg",
  Usman: "https://randomuser.me/api/portraits/men/7.jpg",
  Ali: "https://randomuser.me/api/portraits/men/12.jpg",
};

const baseCalls = [
  {
    id: "1",
    name: "Ayesha",
    avatar: chatAvatars.Ayesha,
    time: "Today, 2:30 PM",
    type: "incoming",
    mode: "audio",
  },
  {
    id: "2",
    name: "Ali",
    avatar: chatAvatars.Ali,
    time: "Yesterday, 5:15 PM",
    type: "missed",
    mode: "audio",
  },
  {
    id: "3",
    name: "Fatima",
    avatar: chatAvatars.Fatima,
    time: "Yesterday, 8:00 PM",
    type: "outgoing",
    mode: "video",
  },
  {
    id: "4",
    name: "Usman",
    avatar: chatAvatars.Usman,
    time: "Today, 11:00 AM",
    type: "missed",
    mode: "video",
  },
];

const repeatedCalls = Array(8)
  .fill(baseCalls)
  .flat()
  .map((call, index) => ({ ...call, id: `${index + 1}` }));

const CallScreen = () => {
  const [search, setSearch] = useState("");
  const [callType, setCallType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCallTypeModal, setShowCallTypeModal] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        const filtered = data
          .filter((c) => c.phoneNumbers?.length > 0)
          .map((c, i) => ({
            id: c.id || i.toString(),
            name: c.name || "Unknown",
            avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
            phone: c.phoneNumbers[0]?.number || "",
          }));

        // Remove duplicates based on phone number
        const uniqueContacts = Array.from(
          new Map(filtered.map((c) => [c.phone, c])).values()
        );

        setAllContacts(uniqueContacts);
      }
    })();
  }, []);

  const filteredCalls = repeatedCalls.filter((call) =>
    call.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleContactSelect = (contact) => {
    setShowModal(false);
    setTimeout(() => {
      router.push({
        pathname: callType === "voice" ? "/Screen/VoiceCall" : "/Screen/VideoCall",
        params: { name: contact.name, avatar: contact.avatar },
      });
    }, 300);
  };

  const renderCallItem = ({ item }) => {
    const iconColor =
      item.type === "incoming"
        ? "#05AA82"
        : item.type === "outgoing"
          ? "#4B7BEC"
          : "#FF3B30";

    return (
      <TouchableOpacity style={styles.callItem}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.callInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.callDetails}>
            <Feather
              name={
                item.type === "incoming"
                  ? "arrow-down-left"
                  : item.type === "outgoing"
                    ? "arrow-up-right"
                    : "phone-off"
              }
              size={16}
              color={iconColor}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.time}>{item.time}</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/Screen/VoiceCall",
                params: { name: item.name, avatar: item.avatar },
              })
            }
          >
            <Ionicons name="call-outline" size={22} color="#05AA82" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/Screen/VideoCall",
                params: { name: item.name, avatar: item.avatar },
              })
            }
          >
            <Ionicons name="videocam-outline" size={22} color="#4B7BEC" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Calls</Text>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Search calls..."
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <FlatList
          data={filteredCalls}
          keyExtractor={(item) => item.id}
          renderItem={renderCallItem}
          contentContainerStyle={{ paddingBottom: 90 }}
          showsVerticalScrollIndicator={false}
        />

        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowCallTypeModal(true)}
        >
          <MaterialIcons name="add-call" size={24} color="#fff" />
        </TouchableOpacity>

        <Modal transparent visible={showCallTypeModal} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.callTypeModal}>
              <Text style={styles.modalTitle}>Choose Call Type</Text>

              <TouchableOpacity
                style={styles.callOption}
                onPress={() => {
                  setCallType("voice");
                  setShowCallTypeModal(false);
                  setShowModal(true);
                }}
              >
                <Ionicons name="call-outline" size={24} color="#05AA82" />
                <Text style={styles.callOptionText}>Voice Call</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.callOption}
                onPress={() => {
                  setCallType("video");
                  setShowCallTypeModal(false);
                  setShowModal(true);
                }}
              >
                <Ionicons name="videocam-outline" size={24} color="#4B7BEC" />
                <Text style={styles.callOptionText}>Video Call</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowCallTypeModal(false)}>
                <Text style={{ color: "#999", marginTop: 10, textAlign: "center" }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Contact Picker Modal */}
        <Modal visible={showModal} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.contactModal}>
              <Text style={styles.modalTitle}>Select Contact</Text>

              <FlatList
                data={allContacts}
                keyExtractor={(item) => item.id}
                style={{ width: "100%" }}
                contentContainerStyle={{ paddingBottom: 10 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleContactSelect(item)}
                    style={styles.contactItem}
                  >
                    <Image
                      source={{ uri: item.avatar }}
                      style={styles.contactAvatar}
                    />
                    <View>
                      <Text style={styles.contactName}>{item.name}</Text>
                      <Text style={styles.contactPhone}>{item.phone}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />

              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={{ color: "#05AA82", marginTop: 10, textAlign: "center" }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

export default CallScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(15),
    justifyContent: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    marginTop: moderateScale(30),
  },
  headerTitle: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    color: "#05AA82",
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
  },
  callItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: scale(12),
    borderBottomWidth: 0.5,
    borderColor: "#eee",
  },
  avatar: {
    width: scale(55),
    height: scale(55),
    borderRadius: scale(27),
    marginRight: scale(12),
  },
  callInfo: {
    flex: 1,
  },
  name: {
    fontSize: moderateScale(15),
    fontWeight: "bold",
    color: "#000",
  },
  callDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(2),
  },
  time: {
    fontSize: moderateScale(12),
    color: "#888",
  },
  fab: {
    position: "absolute",
    bottom: scale(110),
    right: scale(20),
    backgroundColor: "#05AA82",
    width: scale(55),
    height: scale(55),
    borderRadius: scale(30),
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000077",
    justifyContent: "center",
    alignItems: "center",
  },
  callTypeModal: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  callOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    width: "100%",
    justifyContent: "center",
    gap: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  callOptionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  contactModal: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    width: "90%",
    maxHeight: "70%",
    alignItems: "center",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: "#eee",
    gap: 12,
    paddingHorizontal: 5,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  contactName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  contactPhone: {
    fontSize: 13,
    color: "#777",
  },
});
