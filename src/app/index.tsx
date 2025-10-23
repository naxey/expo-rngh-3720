import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

export default function Screen() {
  return (
    <View style={styles.container}>
      <ReanimatedSwipeable
        renderRightActions={(_, __, { close }) => (
          <TouchableOpacity onPress={close} style={styles.actionButton}>
            <Text style={styles.actionText}>Action</Text>
          </TouchableOpacity>
        )}
      >
        <View style={styles.itemContainer}>
          <Text style={styles.itemTitle}>Swipe to crash</Text>
        </View>
      </ReanimatedSwipeable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
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
