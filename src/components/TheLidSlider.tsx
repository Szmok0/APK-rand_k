// THE LID — one reusable 5-point slider control (Profiler concept doc
// section 5 / THE_LID slider spec). The track line, its 5 dots and the "1 2
// 3 4 5" numerals are baked into the background art
// (assets/noir/profiler/lid_bg.jpg) — this component only turns touches
// into a 1-5 value and positions the dinosaur pointer image on top of it.
// Never a native/platform slider (spec explicitly rules that out — it
// wouldn't match the art).
//
// Built on core React Native's PanResponder, not
// react-native-gesture-handler/Reanimated worklets — an earlier version
// used GestureDetector + runOnJS and crashed on a real device the moment a
// drag started (worked fine on web, where RNGH's gesture callbacks never
// actually run as native-thread worklets, so web testing never caught it).
// PanResponder has no native module of its own and no worklet boundary to
// get wrong, at the cost of being a slightly more manual API.
//
// The parent (app/profiler/lid.tsx) sizes this component's container to
// exactly span the baked track's dot-1-to-dot-5 width for the attribute it
// represents; this component measures that real width via onLayout rather
// than assuming any fixed px, so it works on any device size.

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Image, LayoutChangeEvent, PanResponder, StyleSheet, View } from 'react-native';

// Exact aspect ratio of assets/noir/profiler/lid_pointer.png (176x229).
const POINTER_ASPECT = 176 / 229;
const POINTER_WIDTH = 34;
const POINTER_HEIGHT = POINTER_WIDTH / POINTER_ASPECT;

// How many px of MORE horizontal than vertical movement this control needs
// before it claims the touch, instead of letting it pass through to the
// outer vertical ScrollView (this screen has 9 of these, taller than one
// viewport). Kept small — real taps always jitter a couple of px — so a
// plain tap-to-jump still registers in practice, while an intentional
// vertical scroll starting on a slider row isn't swallowed by it.
const CLAIM_THRESHOLD = 2;

type LidValue = 1 | 2 | 3 | 4 | 5;

function valueFromX(x: number, width: number): LidValue {
  if (width <= 0) return 3;
  const ratio = Math.max(0, Math.min(1, x / width));
  const raw = Math.round(ratio * 4) + 1;
  return Math.max(1, Math.min(5, raw)) as LidValue;
}

type Props = {
  value: LidValue;
  // Fires on every touch move (for the pointer + description to track the
  // finger live) AND once more, final, when the gesture ends — see
  // onChange vs onChangeEnd below for the persistence split.
  onChange: (value: LidValue) => void;
  // Fires only once per gesture (release, or a plain tap) — app/profiler/lid.tsx
  // persists on this one, not on every in-between frame.
  onChangeEnd: (value: LidValue) => void;
};

export function TheLidSlider({ value, onChange, onChangeEnd }: Props) {
  const [width, setWidth] = useState(0);
  // PanResponder's callbacks are created once (inside useMemo, see below)
  // and closed over by reference — a ref keeps them reading the CURRENT
  // width/callbacks instead of whatever was current the one time the
  // responder was built.
  const widthRef = useRef(0);
  const onChangeRef = useRef(onChange);
  const onChangeEndRef = useRef(onChangeEnd);
  widthRef.current = width;
  onChangeRef.current = onChange;
  onChangeEndRef.current = onChangeEnd;

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  }, []);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onStartShouldSetPanResponderCapture: () => false,
        // Claim the touch only once it's moved clearly more horizontally
        // than vertically — a vertical scroll starting on a slider row
        // passes straight through to the ScrollView instead of getting
        // stuck here.
        onMoveShouldSetPanResponder: (_evt, gesture) =>
          Math.abs(gesture.dx) > CLAIM_THRESHOLD && Math.abs(gesture.dx) > Math.abs(gesture.dy),
        onMoveShouldSetPanResponderCapture: (_evt, gesture) =>
          Math.abs(gesture.dx) > CLAIM_THRESHOLD && Math.abs(gesture.dx) > Math.abs(gesture.dy),
        onPanResponderGrant: (evt) => {
          onChangeRef.current(valueFromX(evt.nativeEvent.locationX, widthRef.current));
        },
        onPanResponderMove: (evt) => {
          onChangeRef.current(valueFromX(evt.nativeEvent.locationX, widthRef.current));
        },
        onPanResponderRelease: (evt) => {
          onChangeEndRef.current(valueFromX(evt.nativeEvent.locationX, widthRef.current));
        },
        onPanResponderTerminate: (evt) => {
          onChangeEndRef.current(valueFromX(evt.nativeEvent.locationX, widthRef.current));
        },
      }),
    []
  );

  const pointerCenterX = width > 0 ? ((value - 1) / 4) * width : 0;

  return (
    <View style={styles.hitArea} onLayout={onLayout} {...panResponder.panHandlers}>
      {width > 0 && (
        <Image
          source={require('../../assets/noir/profiler/lid_pointer.png')}
          style={[styles.pointer, { left: pointerCenterX - POINTER_WIDTH / 2 }]}
          resizeMode="contain"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hitArea: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  pointer: {
    position: 'absolute',
    top: '50%',
    width: POINTER_WIDTH,
    height: POINTER_HEIGHT,
    marginTop: -POINTER_HEIGHT / 2,
  },
});
