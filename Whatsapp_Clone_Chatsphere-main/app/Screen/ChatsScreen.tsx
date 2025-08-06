import { Ionicons } from "@expo/vector-icons";
import * as Contacts from "expo-contacts";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import {
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
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
const ContactPickerModal = ({ visible, onClose, contacts, onSelect, existingChatNames }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = contacts.filter(
    (contact) =>
      contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !existingChatNames.includes(contact.name)
  );

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>

        <View style={styles.contactModalHeader}>
          <Ionicons name="search" size={20} color="#999" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Search contacts..."
            placeholderTextColor="#999"
            style={styles.contactSearchInput}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#000" style={{ marginLeft: 10 }} />
          </TouchableOpacity>
        </View>

        {/* Contact List */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => onSelect(item)}
            >
              <Image
                source={{ uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png" }}
                style={styles.contactAvatar}
              />
              <View>
                <Text style={styles.contactName}>{item.name}</Text>
                <Text style={styles.contactNumber}>
                  {item.phoneNumbers?.[0]?.number || "No number"}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );
};
const CreateCustomTabModal = ({ visible, onClose, chats, onSubmit, existingTabs }) => {
  const [tabName, setTabName] = useState("");
  const [selectedChats, setSelectedChats] = useState([]);
  const [search, setSearch] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const toggleSelection = (chat) => {
    const exists = selectedChats.some((c) => c.id === chat.id);
    setSelectedChats((prev) =>
      exists ? prev.filter((c) => c.id !== chat.id) : [...prev, chat]
    );
  };

  const handleDone = () => {
    const name = tabName.trim();

    if (!name) {
      setErrorMsg("⚠️ Tab name cannot be empty.");
      return;
    }

    if (existingTabs.includes(name)) {
      setErrorMsg(`❌ Tab "${name}" already exists.`);
      return;
    }

    if (selectedChats.length === 0) {
      setErrorMsg("⚠️ Please select at least one chat.");
      return;
    }

    onSubmit(name, selectedChats);
    setTabName("");
    setSelectedChats([]);
    setSearch("");
    setErrorMsg("");
  };

  const filteredChats = chats.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer2}>
        <View style={styles.searchBar2}>
          <Ionicons name="search" size={20} color="#999" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Search chats..."
            style={styles.searchInput2}
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Enter Tab Name"
          style={styles.tabInput}
          value={tabName}
          onChangeText={(text) => {
            setTabName(text);
            setErrorMsg("");
          }}
        />

        {errorMsg !== "" && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

        <FlatList
          data={filteredChats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isSelected = selectedChats.some((c) => c.id === item.id);
            return (
              <TouchableOpacity
                style={[styles.contactItem2, isSelected && styles.selectedItem]}
                onPress={() => toggleSelection(item)}
              >
                <Image source={{ uri: item.avatar }} style={styles.avatar2} />
                <View>
                  <Text style={styles.name2}>{item.name}</Text>
                </View>
                <Ionicons
                  name={isSelected ? "checkmark-circle" : "ellipse-outline"}
                  size={22}
                  color={isSelected ? "#05AA82" : "#ccc"}
                  style={{ marginLeft: "auto" }}
                />
              </TouchableOpacity>
            );
          }}
        />

        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneText}>Create Tab</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};



const initialChats = [
  { id: "1", name: "Ayesha", message: "Kal milte hain!", time: "11:30 AM", unread: 2, favorite: true, pinned: false, group: false, tags: [], avatar: "https://wallpapers.com/images/hd/pretty-snow-white-n9otqz6ijd2ze1mo.jpg" },
  { id: "2", name: "Anees", message: "Meeting confirm ho gayi hai.", time: "10:12 AM", unread: 0, favorite: false, pinned: false, group: false, tags: [], avatar: "https://i.pinimg.com/236x/5d/8e/6c/5d8e6c121b9ac308a6f6b5c5b722109d.jpg" },
  { id: "3", name: "Zuniar", message: "Theek hai, done!", time: "9:45 AM", unread: 1, favorite: false, pinned: false, group: false, tags: [], avatar: "https://randomuser.me/api/portraits/women/3.jpg" },
  { id: "4", name: "Noman", message: "PDF bhej dia hai.", time: "Yesterday", unread: 0, favorite: false, pinned: false, group: false, tags: [], avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
  { id: "5", name: "Samar", message: "Nice work 👍", time: "2:00 PM", unread: 3, favorite: false, pinned: false, group: false, tags: [], avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtbJnTwQF5UdIZmpRv1pWbjkng2CJkR0xw1g&s" },
  { id: "6", name: "Fatima", message: "Okay, noted!", time: "Today", unread: 0, favorite: false, pinned: false, group: false, tags: [], avatar: "https://i.pinimg.com/736x/72/9c/9d/729c9de0a72d86ec4490de02099ea827.jpg" },
  { id: "7", name: "Usman", message: "Let's catch up soon.", time: "3:15 PM", unread: 0, favorite: false, pinned: false, group: false, tags: [], avatar: "https://randomuser.me/api/portraits/men/7.jpg" },
  { id: "8", name: "Chachu Group", message: "Picnic plan confirm hai 🚗", time: "1:22 PM", unread: 2, favorite: false, pinned: false, group: true, tags: [], avatar: "https://cdn-icons-png.flaticon.com/512/3062/3062634.png" },
  { id: "9", name: "Batija Group", message: "Game night kab?", time: "4:05 PM", unread: 4, favorite: false, pinned: false, group: true, tags: [], avatar: "https://cdn-icons-png.flaticon.com/512/1184/1184121.png" },
  { id: "10", name: "Family", message: "Dinner ready hai 😋", time: "9:55 AM", unread: 3, favorite: false, pinned: false, group: true, tags: [], avatar: "https://cdn-icons-png.flaticon.com/512/847/847969.png" },
];
interface Chat {
  id: string;
  name: string;
  message: string;
  time: string;
  unread: number;
  favorite: boolean;
  group: boolean;
  tags: string[];
  avatar: string;
}


const defaultTabs = ["All", "Unread", "Groups", "Favorites", "+"];

const ChatsScreen = () => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [customTabs, setCustomTabs] = useState<string[]>([]);

  const [newTabName, setNewTabName] = useState("");
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [allContacts, setAllContacts] = useState<Contacts.Contact[]>([]);
  const [customTabModalVisible, setCustomTabModalVisible] = useState(false);
  const [selectedChats, setSelectedChats] = useState<string[]>([]);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const { tabName, selectedNames } = useLocalSearchParams();
  useEffect(() => {
    if (tabName && selectedNames) {
      const name = typeof tabName === "string" ? tabName : tabName[0] ?? "";

      let parsedNames: string[] = [];

      try {
        const raw = JSON.parse(selectedNames as string);


        if (Array.isArray(raw) && raw.every((n) => typeof n === "string")) {
          parsedNames = raw;
        } else {
          console.warn("Invalid selectedNames format");
          return;
        }
      } catch (err) {
        console.warn("Failed to parse selectedNames:", err);
        return;
      }


      setCustomTabs((prev) => (prev.includes(name) ? prev : [...prev, name]));


      setChats((prevChats) =>
        prevChats.map((chat) =>
          parsedNames.includes(chat.name)
            ? {
              ...chat,
              tags: chat.tags.includes(name) ? chat.tags : [...chat.tags, name],
            }
            : chat
        )
      );
    }
  }, [tabName, selectedNames]);



  const openContactPicker = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "We need access to your contacts.");
      return;
    }

    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers],
    });

    if (data.length === 0) {
      Alert.alert("No contacts", "No contacts found on your phone.");
      return;
    }

    setAllContacts(data);
    setContactModalVisible(true);
  };

  const handleContactSelect = (contact) => {
    const alreadyExists = chats.some((chat) => chat.name === contact.name);
    if (alreadyExists) {
      Alert.alert("Already Added", `${contact.name} is already in your chats.`);
      return;
    }

    const newChat = {
      id: Date.now().toString(),
      name: contact.name || "Unnamed",
      message: "New contact added!",
      time: "Now",
      unread: 0,
      favorite: false,
      group: false,
      tags: [],
      avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    };
    setChats((prev) => [newChat, ...prev]);
    setContactModalVisible(false);
  };
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Camera access is required.");
      return;
    }
    await ImagePicker.launchCameraAsync();
  };

  const handleAddTab = () => {
    const name = newTabName.trim();
    if (!name) return;
    if (customTabs.includes(name) || defaultTabs.includes(name)) {
      Alert.alert("Tab already exists");
      return;
    }
    setCustomTabs([...customTabs, name]);
    setNewTabName("");

  };

  const filterChats = chats
    .filter((chat) => {
      const matchesSearch = chat.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        activeFilter === "All"
          ? true
          : activeFilter === "Unread"
            ? chat.unread > 0
            : activeFilter === "Groups"
              ? chat.group
              : activeFilter === "Favorites"
                ? chat.favorite
                : chat.tags.includes(activeFilter);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => b.pinned - a.pinned);

  const renderChatItem = ({ item }) => {
    const isSelected = selectedChats.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.chatItem, isSelected && { backgroundColor: "#e6f9f3" }]}
        onPress={() => {
          if (multiSelectMode) {
            if (isSelected) {
              setSelectedChats((prev) => prev.filter((id) => id !== item.id));
              if (selectedChats.length === 1) setMultiSelectMode(false);
            } else {
              setSelectedChats((prev) => [...prev, item.id]);
            }
          } else {
            router.push({
              pathname: "/Screen/Chats",
              params: { name: item.name, avatar: item.avatar },
            });
          }
        }}
        onLongPress={() => {
          if (!multiSelectMode) {
            setMultiSelectMode(true);
            setSelectedChats([item.id]);
          }
        }}
      >
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
          <View style={styles.chatFooter}>
            <Text style={styles.message} numberOfLines={1}>{item.message}</Text>
            {item.unread > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.unread}</Text>
              </View>
            )}
          </View>
        </View>
        {multiSelectMode && (
          <Ionicons
            name={isSelected ? "checkmark-circle" : "ellipse-outline"}
            size={22}
            color={isSelected ? "#05AA82" : "#ccc"}
            style={{ marginLeft: 10 }}
          />
        )}
      </TouchableOpacity>
    );
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {multiSelectMode ? (
          <Text style={[styles.headerTitle, { color: "#000" }]}>
            {selectedChats.length} selected
          </Text>
        ) : (
          <>
            <Text style={styles.headerTitle}>Chatsphere</Text>
            <TouchableOpacity onPress={openCamera}>
              <Ionicons name="camera-outline" size={24} color="#000" />
            </TouchableOpacity>
          </>
        )}
      </View>

      {multiSelectMode && (
        <ActionBar
          onPin={() => {
            setChats((prev) =>
              prev.map((chat) =>
                selectedChats.includes(chat.id)
                  ? { ...chat, pinned: !chat.pinned }
                  : chat
              )
            );
            setMultiSelectMode(false);
            setSelectedChats([]);
          }}
          onDelete={() => {
            setChats((prev) =>
              prev.filter((chat) => !selectedChats.includes(chat.id))
            );
            setMultiSelectMode(false);
            setSelectedChats([]);
          }}
          onClose={() => {
            setMultiSelectMode(false);
            setSelectedChats([]);
          }}
        />
      )}


      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#999" style={{ marginRight: 10 }} />
        <TextInput
          placeholder="Search..."
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.fixedTabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
          style={styles.tabs}
        >
          {[...defaultTabs.slice(0, -1), ...customTabs, "+"].map((tab) => {
            const isCustom = !defaultTabs.includes(tab) && tab !== "+";
            const key = isCustom ? `custom_${tab}` : tab;

            return (
              <TouchableOpacity
                key={key}
                onPress={() => {
                  if (tab === "+") {

                    setCustomTabModalVisible(true);
                  }
                  else setActiveFilter(tab);
                }
                }
                onLongPress={() => {
                  if (isCustom) {
                    Alert.alert(
                      "Delete Tab",
                      `Do you want to delete \"${tab}\"?`,
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Delete",
                          style: "destructive",
                          onPress: () => {
                            setCustomTabs((prev) => prev.filter((t) => t !== tab));
                            setChats((prevChats) =>
                              prevChats.map((c) => ({
                                ...c,
                                tags: c.tags.filter((tag) => tag !== tab),
                              }))
                            );
                            if (activeFilter === tab) setActiveFilter("All");
                          },
                        },
                      ]
                    );
                  }
                }}
                style={[styles.tab, activeFilter === tab && styles.activeTab]}
              >
                <Text style={[styles.tabText, activeFilter === tab && styles.activeTabText]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {filterChats.length === 0 ? (
        <View style={{ alignItems: "center", marginTop: 50 }}>
          <Text style={{ fontSize: 16, color: "#aaa" }}>No chats to display.</Text>
        </View>
      ) : (
        <FlatList
          data={filterChats}
          keyExtractor={(item) => item.id}
          renderItem={renderChatItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 130 }}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={openContactPicker}>
        <Ionicons name="person-add" size={24} color="#fff" />
      </TouchableOpacity>

      <ContactPickerModal
        visible={contactModalVisible}
        onClose={() => setContactModalVisible(false)}
        contacts={allContacts}
        onSelect={handleContactSelect}
        existingChatNames={chats.map((chat) => chat.name)}
      />
      <CreateCustomTabModal
        visible={customTabModalVisible}
        onClose={() => setCustomTabModalVisible(false)}
        chats={chats}
        existingTabs={[...customTabs, ...defaultTabs]}
        onSubmit={(name, selectedChats) => {
          setCustomTabs((prev) => [...prev, name]);

          setChats((prevChats) =>
            prevChats.map((chat) =>
              selectedChats.some((c) => c.id === chat.id)
                ? { ...chat, tags: [...new Set([...chat.tags, name])] }
                : chat
            )
          );

          setCustomTabModalVisible(false);
          setActiveFilter(name);
        }}
      />



    </View>
  );
};


export default ChatsScreen;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#fff",
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(15),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.4,
    borderBottomColor: "#ccc",
    marginTop: moderateScale(30),
  },
  headerTitle: {
    color: "#05AA82",
    fontSize: moderateScale(30),
    fontWeight: "bold",
    fontFamily: "cursive",
  },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#f1f1f1",
    margin: scale(10),
    padding: scale(10),
    borderRadius: scale(25),
    alignItems: "center",
  },
  searchInput: { flex: 1, fontSize: moderateScale(13) },
  fixedTabsWrapper: { height: verticalScale(40), justifyContent: "center" },
  tabs: { paddingHorizontal: scale(10) },
  tabsContainer: { flexDirection: "row", alignItems: "center" },
  tab: {
    marginRight: scale(8),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(5),
    borderRadius: scale(15),
    backgroundColor: "#f0f0f0",
  },
  activeTab: { backgroundColor: "#05AA82" },
  tabText: { fontSize: moderateScale(13), color: "#555" },
  activeTabText: { color: "#fff", fontWeight: "bold" },
  chatItem: {
    flexDirection: "row",
    padding: scale(12),
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
    alignItems: "center",
  },
  avatar: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    marginRight: scale(10),
  },
  chatContent: { flex: 1 },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(3),
  },
  name: {
    fontWeight: "bold",
    fontSize: moderateScale(15),
    color: "#000",
  },
  time: { fontSize: moderateScale(11), color: "#888" },
  chatFooter: { flexDirection: "row", justifyContent: "space-between" },
  message: {
    fontSize: moderateScale(13),
    color: "#555",
    maxWidth: "80%",
  },
  badge: {
    backgroundColor: "#05AA82",
    paddingHorizontal: scale(6),
    paddingVertical: verticalScale(2),
    borderRadius: scale(10),
    minWidth: scale(20),
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: moderateScale(10),
    fontWeight: "bold",
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "transparent",

  },
  modalBox: {
    backgroundColor: "#fff",
    width: "80%",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: moderateScale(18),
    marginBottom: verticalScale(10),
    color: "#05AA82",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: "100%",
    marginTop: 10,
    borderRadius: 8,
    padding: 10,
  },
  modalButton: {
    marginTop: 15,
    backgroundColor: "#05AA82",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: moderateScale(14),
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  contactModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "#f1f1f1",
    margin: 10,
    borderRadius: 25,
    borderWidth: 0.5,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  contactSearchInput: {
    flex: 1,
    fontSize: 14,
    color: "#000",
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(16),
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  contactName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#000",
  },
  contactNumber: {
    fontSize: 13,
    color: "#666",
  },
  modalContainer2: { flex: 1, backgroundColor: "#fff", paddingTop: 30 },
  searchBar2: {
    flexDirection: "row",
    backgroundColor: "#f1f1f1",
    margin: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 25,
    alignItems: "center",
  },
  searchInput2: {
    flex: 1,
    fontSize: 14,
    color: "#000",
  },
  tabInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 15,
    marginBottom: 10,
    marginTop: 5,
    fontSize: 14,
  },
  errorBox: {
    backgroundColor: "#ffe6e6",
    borderColor: "#ff4d4d",
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 15,
    marginBottom: 10,
    padding: 10,
  },
  errorText: {
    color: "#cc0000",
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
  },
  contactItem2: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 0.5,
    borderColor: "#eee",
  },
  selectedItem: { backgroundColor: "#e6f9f3" },
  avatar2: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  name2: { fontSize: 15, fontWeight: "600", color: "#000" },
  doneButton: {
    backgroundColor: "#05AA82",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginHorizontal: 15,
    marginTop: 20,
  },
  doneText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
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



