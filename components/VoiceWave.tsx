import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export const VoiceWave = ({ isActive }: { isActive: boolean }) => {
  const animations = useRef([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
  ]).current;

  useEffect(() => {
    if (isActive) {
      const createAnimation = (val: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(val, {
              toValue: 2.5,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(val, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
          ])
        );
      };

      const anims = animations.map((anim, i) => createAnimation(anim, i * 150));
      Animated.parallel(anims).start();

      return () => {
        anims.forEach(a => a.stop());
        animations.forEach(a => a.setValue(1));
      };
    }
  }, [isActive]);

  return (
    <View style={styles.container}>
      {animations.map((anim, i) => (
        <Animated.View
          key={i}
          style={[
            styles.bar,
            {
                transform: [{ scaleY: anim }],
                opacity: isActive ? 1 : 0.3,
                height: 30 + (i % 3) * 10
            }
          ]}
        >
          <LinearGradient
            colors={['#7c3aed', '#db2777']}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    gap: 8,
  },
  bar: {
    width: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
});
