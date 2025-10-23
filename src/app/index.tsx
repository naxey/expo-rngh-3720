import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

const DATA = Array.from({ length: 6 }, (_, i) => `Item ${i + 1}`);

export default function Screen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={DATA}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <ReanimatedSwipeable
            renderRightActions={(_, __, { close }) => (
              <TouchableOpacity onPress={close} style={styles.actionButton}>
                <Text style={styles.actionText}>Action</Text>
              </TouchableOpacity>
            )}
          >
            <View style={styles.itemContainer}>
              <Text style={styles.itemTitle}>{item}</Text>
            </View>
          </ReanimatedSwipeable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actionButton: {
    width: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
  },
  itemContainer: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
});
