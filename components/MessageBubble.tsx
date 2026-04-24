import React from "react";
import { View, Text, TouchableOpacity, Clipboard } from "react-native";
import { Message } from "../lib/api";

interface MessageBubbleProps {
  message: Message;
  onLongPress: (message: Message) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onLongPress }) => {
  const isAi = message.role === "ai";

  return (
    <TouchableOpacity
      onLongPress={() => onLongPress(message)}
      activeOpacity={0.8}
      className={`max-w-[80%] my-1 p-3 rounded-2xl ${
        isAi ? "bg-gray-800 self-start ml-4" : "bg-primary self-end mr-4"
      }`}
    >
      <Text className="text-white text-base">{message.text}</Text>
      <Text className="text-gray-400 text-[10px] mt-1 self-end">
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </TouchableOpacity>
  );
};
