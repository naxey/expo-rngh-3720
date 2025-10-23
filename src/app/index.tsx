/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import { useMemo } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  SwipeableRow,
  SwipeActions,
  useCloseSwipeOnScroll,
  useLongPressOpenSwipe,
  useSingleOpenSwipeable,
} from '@/components/common/swipeable';

type DemoItem = { id: string; title: string };

const DATA: DemoItem[] = Array.from({ length: 6 }).map((_, i) => ({
  id: `${i + 1}`,
  title: `Demo item ${i + 1}`,
}));

function Row({
  item,
  onRowOpen,
}: {
  item: DemoItem;
  onRowOpen: (ref: any) => void;
}) {
  const swipeableRef = React.useRef<any>(null);
  const { handleLongPress, suppressPress } = useLongPressOpenSwipe(
    swipeableRef,
    onRowOpen
  );

  const renderRightActions = (
    _progress: any,
    _drag: any,
    methods: { close: () => void }
  ) => (
    <SwipeActions
      methods={methods}
      onEdit={() => console.log('edit', item.id)}
      onDelete={() => console.log('delete', item.id)}
    />
  );

  return (
    <SwipeableRow
      ref={swipeableRef}
      onRowOpen={onRowOpen}
      renderRightActions={renderRightActions}
    >
      <TouchableOpacity
        onLongPress={handleLongPress}
        disabled={suppressPress}
        style={styles.row}
        activeOpacity={0.7}
      >
        <Text style={styles.rowText}>{item.title}</Text>
      </TouchableOpacity>
    </SwipeableRow>
  );
}

export default function ShoppingList() {
  const data = useMemo(() => DATA, []);
  const { onRowOpen } = useSingleOpenSwipeable();
  const { onScrollBeginDrag } = useCloseSwipeOnScroll(onRowOpen);

  const renderItem = ({ item }: { item: DemoItem }) => (
    <Row item={item} onRowOpen={onRowOpen} />
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={styles.container}
        data={data}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        onScrollBeginDrag={onScrollBeginDrag}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  row: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  rowText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
