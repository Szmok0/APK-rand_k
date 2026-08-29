// THE LID — one reusable 5-point slider control (Profiler concept doc
// section 5 / THE_LID slider spec). The track line, its 5 dots and the "1 2
// 3 4 5" numerals are baked into the background art
// (assets/noir/profiler/lid_bg.jpg) — this component only turns touches
// into a 1-5 value and positions the dinosaur pointer image on top of it.
// Never a native/platform slider (spec explicitly rules that out — it
// wouldn't match the art).
//
// The parent (app/profiler/lid.tsx) sizes this component's container to
// exactly span the baked track's dot-1-to-dot-5 width for the attribute it
// represents; this component measures that real width via onLayout rather
// than assuming any fixed px, so it works on any device size.

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

// Exact aspect ratio of assets/noir/profiler/lid_pointer.png (176x229).
const POINTER_ASPECT = 176 / 229;
const POINTER_WIDTH = 34;
const POINTER_HEIGHT = POINTER_WIDTH / POINTER_ASPECT;

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

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  }, []);

  // Keep a live ref to the latest width/callbacks so the memoized Gesture
  // below never closes over stale values without needing to be rebuilt on
  // every render (rebuilding it on every value/width change is fine here
  // since both change rarely, but this keeps the dependency list honest).
  const preview = useCallback((v: LidValue) => onChange(v), [onChange]);
  const commit = useCallback((v: LidValue) => onChangeEnd(v), [onChangeEnd]);

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .hitSlop({ left: 20, right: 20, top: 18, bottom: 18 })
        // This control lives inside a vertical ScrollView (the screen has 9
        // of these, taller than one viewport). Without these two, ANY touch
        // that starts on a slider — including someone just trying to scroll
        // past it — gets captured as a horizontal pan. A tiny activeOffsetX
        // (real taps always jitter past ~2px) still lets a plain tap-to-jump
        // register, while failOffsetY releases the touch back to the
        // ScrollView the moment it moves vertically first.
        .activeOffsetX([-2, 2])
        .failOffsetY([-12, 12])
        // onStart (not onBegin) on purpose: onBegin fires on every touch-down
        // before it's known whether this is a horizontal drag or a vertical
        // scroll passing through — jumping the pointer there would move the
        // slider on a touch that turns out to just be scrolling. onStart only
        // fires once activeOffsetX has confirmed real horizontal intent.
        .onStart((e) => {
          runOnJS(preview)(valueFromX(e.x, width));
        })
        .onUpdate((e) => {
          runOnJS(preview)(valueFromX(e.x, width));
        })
        .onEnd((e) => {
          runOnJS(commit)(valueFromX(e.x, width));
        }),
    [width, preview, commit]
  );

  const pointerCenterX = width > 0 ? ((value - 1) / 4) * width : 0;

  return (
    <GestureDetector gesture={pan}>
      <View style={styles.hitArea} onLayout={onLayout}>
        {width > 0 && (
          <Image
            source={require('../../assets/noir/profiler/lid_pointer.png')}
            style={[styles.pointer, { left: pointerCenterX - POINTER_WIDTH / 2 }]}
            resizeMode="contain"
          />
        )}
      </View>
    </GestureDetector>
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
