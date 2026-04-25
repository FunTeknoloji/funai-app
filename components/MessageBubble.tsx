import React from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Message } from "../lib/api";
import { LinearGradient } from "expo-linear-gradient";

interface MessageBubbleProps {
  message: Message;
  onLongPress: (message: Message) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onLongPress }) => {
  const isAi = message.role === "ai";

  return (
    <TouchableOpacity
      onLongPress={() => onLongPress(message)}
      activeOpacity={0.9}
      className={`max-w-[85%] my-2 shadow-sm ${
        isAi ? "self-start" : "self-end"
      }`}
    >
      <LinearGradient
        colors={isAi ? ['#1e1e1e', '#121212'] : ['#7c3aed', '#5b21b6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className={`px-4 py-3 rounded-2xl ${
          isAi ? "rounded-tl-none border border-white/5" : "rounded-tr-none shadow-lg shadow-primary/20"
        }`}
      >
        <Text className="text-white text-base leading-6">{message.text}</Text>
        <View className="flex-row items-center justify-end mt-1 opacity-50">
            <Text className="text-[10px] text-white/70">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};
