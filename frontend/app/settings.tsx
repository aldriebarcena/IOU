import { ScrollView, View, StyleSheet } from "react-native";
import List from "@/components/List";

export default function Settings() {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <List
        title="PROFILE INFO"
        items={["Display Name", "Preferred Payment Method"]}
        bulleted={false}
      />
      <List
        title="NOTIFICATIONS"
        items={["Push Notifications", "Message Notifications"]}
        bulleted={false}
      />
      <List
        title="SECURITY"
        items={["Change Password", "Log Out"]}
        bulleted={false}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    paddingTop: 10,
    paddingBottom: 40,
  },
  buttonWrapper: {
    marginHorizontal: 40,
  },
});
