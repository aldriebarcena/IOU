import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

type ListProps = {
  title: string;
  items: string[];
  bulleted?: boolean;
};

export default function List({ title, items, bulleted = true }: ListProps) {
  const [expanded, setExpanded] = useState(false);

  const displayedItems = expanded ? items : items.slice(0, 4);
  const showToggle = items.length > 4;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {displayedItems.map((item, index) => (
        <View key={index} style={styles.itemRow}>
          {bulleted && <Text style={styles.bullet}>•</Text>}
          <Text style={styles.itemText}>{item}</Text>
        </View>
      ))}

      {showToggle && (
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text style={styles.toggle}>
            {expanded ? "Show Less" : "Show More"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 40,
    marginTop: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    color: "#333",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  bullet: {
    color: "#2E8764",
    fontSize: 18,
    marginRight: 8,
    lineHeight: 24,
  },
  itemText: {
    fontSize: 18,
    color: "#444",
    flexShrink: 1,
    lineHeight: 24,
  },
  toggle: {
    color: "#2E8764",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
  },
});
