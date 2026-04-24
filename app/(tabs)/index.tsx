import React, { useState, useRef } from "react";
import { View, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Input, Button, Spinner } from "heroui-native";
import { Send, Mic, Trash2 } from "lucide-react-native";
import { useChat } from "../../context/ChatContext";
import { MessageBubble } from "../../components/MessageBubble";
import { TypingIndicator } from "../../components/TypingIndicator";
import { useRouter } from "expo-router";

export default function ChatScreen() {
  const { currentChat, sendMessage, isTyping, clearHistory, deleteMessage } = useChat();
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const handleSend = async () => {
    if (inputText.trim() === "") return;
    const text = inputText;
    setInputText("");
    await sendMessage(text);
  };

  const handleLongPress = (message: any) => {
    Alert.alert(
      "Seçenekler",
      "Mesajla ne yapmak istersiniz?",
      [
        { text: "Kopyala", onPress: () => Clipboard.setStringAsync(message.text) },
        { text: "Yeniden Sor", onPress: () => {
            setInputText(message.text);
        }},
        { text: "Sil", style: "destructive", onPress: () => {
            if (currentChat) {
                deleteMessage(currentChat.id, message.id);
            }
        }},
        { text: "İptal", style: "cancel" }
      ]
    );
  };

  const handleClear = () => {
    Alert.alert(
      "Sohbeti Temizle",
      "Tüm sohbet geçmişiniz silinecek. Onaylıyor musunuz?",
      [
        { text: "İptal", style: "cancel" },
        { text: "Evet, Sil", style: "destructive", onPress: clearHistory }
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      className="flex-1 bg-black"
    >
      <View className="flex-row justify-between items-center p-4 border-b border-gray-800">
        <TouchableOpacity onPress={handleClear}>
          <Trash2 color="#9ca3af" size={20} />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={currentChat?.messages || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageBubble message={item} onLongPress={handleLongPress} />
        )}
        contentContainerStyle={{ paddingVertical: 20 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={isTyping ? <TypingIndicator /> : null}
      />

      <View className="p-4 flex-row items-center space-x-2 border-t border-gray-800">
        <Input
          placeholder="Mesajınızı yazın..."
          value={inputText}
          onChangeText={setInputText}
          className="flex-1 bg-gray-900 border-none text-white"
          placeholderTextColor="#9ca3af"
        />
        <Button
          variant="solid"
          color="primary"
          onPress={handleSend}
          className="rounded-full w-12 h-12 min-w-0"
        >
          <Send color="white" size={20} />
        </Button>
        <Button
          variant="ghost"
          onPress={() => router.push("/voice")}
          className="rounded-full w-12 h-12 min-w-0"
        >
          <Mic color="#7c3aed" size={24} />
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
