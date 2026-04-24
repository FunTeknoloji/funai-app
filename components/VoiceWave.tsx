import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";

export const VoiceWave = ({ isActive }: { isActive: boolean }) => {
  const scale1 = useRef(new Animated.Value(1)).current;
  const scale2 = useRef(new Animated.Value(1)).current;
  const scale3 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isActive) {
      const animate = (val: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(val, {
              toValue: 2,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(val, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
          ])
        );
      };

      const anim1 = animate(scale1, 0);
      const anim2 = animate(scale2, 200);
      const anim3 = animate(scale3, 400);

      anim1.start();
      anim2.start();
      anim3.start();

      return () => {
        anim1.stop();
        anim2.stop();
        anim3.stop();
        scale1.setValue(1);
        scale2.setValue(1);
        scale3.setValue(1);
      };
    }
  }, [isActive]);

  return (
    <View className="flex-row items-center justify-center space-x-4 h-32">
      <Animated.View
        style={{ transform: [{ scaleY: scale1 }] }}
        className="w-2 h-12 bg-primary rounded-full mx-1"
      />
      <Animated.View
        style={{ transform: [{ scaleY: scale2 }] }}
        className="w-2 h-20 bg-primary rounded-full mx-1"
      />
      <Animated.View
        style={{ transform: [{ scaleY: scale3 }] }}
        className="w-2 h-12 bg-primary rounded-full mx-1"
      />
    </View>
  );
};
