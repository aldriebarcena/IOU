import { ScrollView, View, StyleSheet } from "react-native";
import BigButton from "@/components/BigButton";
import List from "@/components/List";

export default function HomeScreen() {
  const handleReceiptUpload = () => {
    console.log("Upload Receipt Button Pressed");
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <View style={styles.buttonWrapper}>
        <BigButton
          text="UPLOAD NEW RECEIPT"
          functionality={handleReceiptUpload}
        />
      </View>
      <List
        title="RECENT ACTIVITY LIST"
        items={[
          "Receipt #123 (Needs item selection)",
          "Receipt #124 (Waiting for co-payers)",
          "Receipt #125 (Ready to be confirmed)",
        ]}
        bulleted={true}
      />
      <List
        title="NOTIFICATIONS"
        items={[
          "Alex invited you to a receipt",
          "Payment confirmed for Receipt #124",
          "Reminder: Payment due for Receipt #123",
          "You were removed from Receipt #120",
          "New comment on Receipt #123",
        ]}
        bulleted={true}
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
    paddingTop: 40,
    paddingBottom: 40,
  },
  buttonWrapper: {
    marginHorizontal: 40,
  },
});
