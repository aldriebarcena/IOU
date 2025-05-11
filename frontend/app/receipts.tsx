import { ScrollView, View, StyleSheet } from "react-native";
import List from "@/components/List";

export default function Receipts() {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <List
        title="MY RECEIPTS"
        items={[
          "#123 | $45.67 | 03/22/25",
          "#122 | $80.14 | 03/20/25",
          "#121 | $15.00 | 03/18/25",
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
    paddingTop: 10,
    paddingBottom: 40,
  },
  buttonWrapper: {
    marginHorizontal: 40,
  },
});
