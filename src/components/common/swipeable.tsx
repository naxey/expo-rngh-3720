/* eslint-disable react-native/no-inline-styles */
import type { ReactNode } from 'react';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

// Shared config
const SWIPE_FRICTION = 2;
const SWIPE_RIGHT_THRESHOLD = 40;
const SWIPE_OVERSHOOT_FRICTION = 8;
const LONG_PRESS_OPEN_DELAY_MS = 60;
const LONG_PRESS_REOPEN_NUDGE_MS = 50;
const LONG_PRESS_SUPPRESS_RELEASE_MS = 800;

// Shared actions component
const ACTION_WIDTH = 160;
const EDIT_COLOR = '#3B82F6';
const DELETE_COLOR = '#EF4444';
const BORDER_RADIUS = 12;

interface SwipeActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  methods?: { close: () => void };
}

export const SwipeActions = ({
  onEdit,
  onDelete,
  methods,
}: SwipeActionsProps) => {
  const leftEdgeFillerWidth = BORDER_RADIUS;
  const resolvedWidth = ACTION_WIDTH;

  return (
    <View style={{ position: 'relative', height: '100%' }}>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: -leftEdgeFillerWidth,
          top: 0,
          bottom: 0,
          width: leftEdgeFillerWidth,
          backgroundColor: EDIT_COLOR,
        }}
      />
      <View
        style={{
          width: resolvedWidth,
          flexDirection: 'row',
          height: '100%',
          borderTopRightRadius: BORDER_RADIUS,
          borderBottomRightRadius: BORDER_RADIUS,
          overflow: 'hidden',
        }}
      >
        <TouchableOpacity
          onPress={() => {
            onEdit?.();
            methods?.close?.();
          }}
          accessibilityRole="button"
          accessibilityLabel="Edit"
          style={{
            flex: 1,
            backgroundColor: EDIT_COLOR,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Icon type="feather" name="edit-3" size={18} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onDelete?.();
            methods?.close?.();
          }}
          accessibilityRole="button"
          accessibilityLabel="Delete"
          style={{
            flex: 1,
            backgroundColor: DELETE_COLOR,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Icon type="feather" name="trash-2" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Swipeable Row wrapper
type RenderRightActions = (
  progress: any,
  drag: any,
  methods: { close: () => void }
) => ReactNode;

interface SwipeableRowProps {
  children: ReactNode;
  onRowOpen?: (ref: any) => void;
  renderRightActions?: RenderRightActions;
  friction?: number;
  rightThreshold?: number;
  overshootFriction?: number;
}

export const SwipeableRow = forwardRef<any, SwipeableRowProps>(
  (
    {
      children,
      onRowOpen,
      renderRightActions,
      friction = SWIPE_FRICTION,
      rightThreshold = SWIPE_RIGHT_THRESHOLD,
      overshootFriction = SWIPE_OVERSHOOT_FRICTION,
    },
    ref
  ) => {
    const internalRef = useRef<any>(null);
    useImperativeHandle(ref, () => internalRef.current);
    return (
      <ReanimatedSwipeable
        ref={internalRef}
        friction={friction}
        rightThreshold={rightThreshold}
        overshootFriction={overshootFriction}
        renderRightActions={renderRightActions}
        onSwipeableWillOpen={() => onRowOpen?.(internalRef.current)}
        onSwipeableOpen={() => onRowOpen?.(internalRef.current)}
      >
        {children}
      </ReanimatedSwipeable>
    );
  }
);

// Hooks
export const useSingleOpenSwipeable = () => {
  const currentlyOpenSwipeableRef = React.useRef<any>(null);

  const onRowOpen = React.useCallback((rowRef: any) => {
    if (rowRef == null) {
      try {
        currentlyOpenSwipeableRef.current?.close?.();
      } catch (_) {
        // no-op
      }
      currentlyOpenSwipeableRef.current = null;
      return;
    }
    if (
      currentlyOpenSwipeableRef.current &&
      currentlyOpenSwipeableRef.current !== rowRef
    ) {
      try {
        currentlyOpenSwipeableRef.current.close?.();
      } catch (_) {
        // no-op
      }
    }
    currentlyOpenSwipeableRef.current = rowRef;
  }, []);

  const closeOpenRow = React.useCallback(() => {
    try {
      currentlyOpenSwipeableRef.current?.close?.();
    } catch (_) {
      // no-op
    }
    currentlyOpenSwipeableRef.current = null;
  }, []);

  return { onRowOpen, closeOpenRow };
};

export const useLongPressOpenSwipe = (
  swipeableRef: React.MutableRefObject<any>,
  onRowOpen?: (ref: any) => void
) => {
  const [suppressPress, setSuppressPress] = React.useState(false);

  const handleLongPress = React.useCallback(() => {
    setSuppressPress(true);
    setTimeout(() => {
      onRowOpen?.(swipeableRef.current);
      try {
        swipeableRef.current?.openRight?.();
        setTimeout(
          () => swipeableRef.current?.openRight?.(),
          LONG_PRESS_REOPEN_NUDGE_MS
        );
      } catch (_) {
        // no-op
      }
    }, LONG_PRESS_OPEN_DELAY_MS);
    setTimeout(() => setSuppressPress(false), LONG_PRESS_SUPPRESS_RELEASE_MS);
  }, [onRowOpen, swipeableRef]);

  return { handleLongPress, suppressPress };
};

export const useCloseSwipeOnScroll = (onRowOpen: (ref: any | null) => void) => {
  const onScrollBeginDrag = React.useCallback(() => {
    onRowOpen(null);
  }, [onRowOpen]);

  return { onScrollBeginDrag };
};
