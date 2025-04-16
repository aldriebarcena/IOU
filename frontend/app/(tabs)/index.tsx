import { View, Text, StyleSheet, FlatList } from 'react-native';

const dummyGroups = [
  { id: '1', name: 'Roommates', status: 'Pending split' },
  { id: '2', name: 'Birthday Dinner', status: 'All paid' },
];

export default function HomeTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Here are your active groups:</Text>

      <FlatList
        data={dummyGroups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.groupCard}>
            <Text style={styles.groupName}>{item.name}</Text>
            <Text style={styles.groupStatus}>{item.status}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No groups yet</Text>}
        contentContainerStyle={{ paddingTop: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginTop: 8,
  },
  groupCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
  },
  groupName: {
    fontSize: 18,
    fontWeight: '600',
  },
  groupStatus: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  empty: {
    marginTop: 32,
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});
