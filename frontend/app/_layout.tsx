import { Tabs } from "expo-router";
import { ThemeProvider, DefaultTheme } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#2E8764", // green when active
          tabBarInactiveTintColor: "#999", // gray when inactive
          tabBarStyle: {
            backgroundColor: "#fff",
          },
          headerStyle: {
            backgroundColor: "#f5f5f5",
          },
          headerTintColor: "#000",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <AntDesign name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="groups"
          options={{
            title: "Groups",
            tabBarIcon: ({ color }) => (
              <AntDesign name="team" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="receipts"
          options={{
            title: "Receipts",
            tabBarIcon: ({ color }) => (
              <AntDesign name="profile" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color }) => (
              <AntDesign name="setting" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}
