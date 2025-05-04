import { View, Text, StyleSheet } from "react-native";
import BigButton from "@/components/BigButton";

export default function GroupsScreen() {
  const handleNewGroup = () => {
    console.log("New Group Button Pressed");
  };
  return (
    <View>
      <BigButton text="Create New Group" functionality={handleNewGroup} />
    </View>
  );
}

const styles = StyleSheet.create({});
