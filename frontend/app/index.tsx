import { View, Text, StyleSheet } from "react-native";
import BigButton from "@/components/BigButton";

export default function HomeScreen() {
  const handleReceiptUpload = () => {
    console.log("Upload Receipt Button Pressed");
  };

  return (
    <View>
      <BigButton
        text="Upload New Receipt"
        functionality={handleReceiptUpload}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
