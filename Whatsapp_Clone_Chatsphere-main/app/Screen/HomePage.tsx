import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

import { Stack } from "expo-router";
import CallsScreen from "./CallsScreen";
import ChatsScreen from "./ChatsScreen";
import CommunitiesScreen from "./CommunitiesScreen";
import SettingsScreen from "./SettingsScreen";
import UpdatesScreen from "./UpdatesScreen";
const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: "#05AA82",
          tabBarInactiveTintColor: "#888]",
          tabBarLabelStyle: {
            fontSize: moderateScale(11),
            marginBottom: Platform.OS === "android" ? verticalScale(5) : 0,
          },
          tabBarItemStyle: {
            marginTop: verticalScale(10),
          },
          tabBarStyle: {
            position: "absolute",
            left: scale(10),
            right: scale(10),
            backgroundColor: "rgba(255,255,255,0.95)",
            borderRadius: moderateScale(6),
            height: verticalScale(100),
            elevation: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.15,
            shadowRadius: 6,
          },
          tabBarIcon: ({ focused, color, size }) => {
            if (route.name === "Communities") {
              return <Ionicons name={focused ? "people" : "people-outline"} size={size} color={color} />;
            } else if (route.name === "Chats") {
              return <Ionicons name={focused ? "chatbubbles" : "chatbubbles-outline"} size={size} color={color} />;
            } else if (route.name === "Updates") {
              return (
                <MaterialCommunityIcons
                  name="heart-pulse"
                  size={size}
                  color={color}
                />
              );
            } else if (route.name === "Calls") {
              return <Ionicons name={focused ? "call" : "call-outline"} size={size} color={color} />;
            } else if (route.name === "Settings") {
              return <Ionicons name={focused ? "settings" : "settings-outline"} size={size} color={color} />;
            }
            return null;
          },
        })}
      >
        <Tab.Screen name="Chats" component={ChatsScreen} />
        <Tab.Screen name="Updates" component={UpdatesScreen} />
        <Tab.Screen name="Communities" component={CommunitiesScreen} />
        <Tab.Screen name="Calls" component={CallsScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </>
  );
};

export default HomeScreen;
