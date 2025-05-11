import { TouchableOpacity, Text, StyleSheet } from "react-native";

type BigButtonProps = {
  text: string;
  functionality: () => void;
};

export default function BigButton({ text, functionality }: BigButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={functionality}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#2E8764",
    paddingVertical: 25, // smaller = skinnier height
    borderRadius: 25,
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "600",
  },
});
