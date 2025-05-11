import { ScrollView, View, StyleSheet } from "react-native";
import BigButton from "@/components/BigButton";
import List from "@/components/List";

export default function GroupsScreen() {
  const handleNewGroup = () => {
    console.log("New Group Button Pressed");
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <View style={styles.buttonWrapper}>
        <BigButton text="CREATE A GROUP" functionality={handleNewGroup} />
      </View>
      <List
        title="MY GROUPS"
        items={[
          "Roommates (1 receipt(s) active)",
          "Vacation (2 receipt(s) active)",
          "Home (0 receipt(s) active)",
          "Friendsgiving (3 receipt(s) active)",
          "Office Team (1 receipt(s) active)",
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
