import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";

export const TypingIndicator = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (val: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(val, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(val, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const anim1 = animate(dot1, 0);
    const anim2 = animate(dot2, 200);
    const anim3 = animate(dot3, 400);

    anim1.start();
    anim2.start();
    anim3.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, []);

  const dotStyle = (val: Animated.Value) => ({
    opacity: val.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    }),
    transform: [
      {
        scale: val.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1.2],
        }),
      },
    ],
  });

  return (
    <View className="flex-row items-center bg-zinc-900 border border-white/5 px-4 py-3 rounded-2xl self-start ml-2 mb-4">
      <Animated.View style={dotStyle(dot1)} className="w-1.5 h-1.5 bg-primary rounded-full mx-0.5" />
      <Animated.View style={dotStyle(dot2)} className="w-1.5 h-1.5 bg-primary rounded-full mx-0.5" />
      <Animated.View style={dotStyle(dot3)} className="w-1.5 h-1.5 bg-primary rounded-full mx-0.5" />
    </View>
  );
};
