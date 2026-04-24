import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Avatar, Input, Button, Card } from "heroui-native";
import { User, Edit2, MessageSquare, List, Trash2 } from "lucide-react-native";
import { useSettings } from "../../context/SettingsContext";
import { useChat } from "../../context/ChatContext";

const EMOJIS = ["👤", "🤖", "🐱", "🐶", "🦊", "🦁", "🐧", "🦄", "🌈", "🔥"];

export default function ProfileScreen() {
  const { userName, setUserName, userAvatar, setUserAvatar, aiNickname, setAiNickname } = useSettings();
  const { conversations, clearHistory } = useChat();

  const totalMessages = conversations.reduce((acc, curr) => acc + curr.messages.length, 0);

  const handleDeleteAll = () => {
    Alert.alert("Tüm Verileri Sil", "Bu işlem geri alınamaz. Devam etmek istiyor musunuz?", [
        { text: "İptal", style: "cancel" },
        { text: "Evet, Her Şeyi Sil", style: "destructive", onPress: clearHistory }
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-black p-6">
      <View className="items-center mb-8">
        <View className="relative">
            <Avatar className="w-24 h-24 bg-gray-800 flex items-center justify-center">
                <Text className="text-5xl">{userAvatar}</Text>
            </Avatar>
        </View>
        <View className="flex-row items-center mt-4">
            <Text className="text-white text-2xl font-bold mr-2">{userName}</Text>
        </View>
      </View>

      <Text className="text-gray-400 font-bold mb-4 uppercase text-xs tracking-widest">Profilini Düzenle</Text>
      <Card className="bg-gray-900 border-none p-4 mb-8">
        <Text className="text-gray-400 text-sm mb-2">Kullanıcı Adı</Text>
        <Input
            value={userName}
            onChangeText={setUserName}
            className="bg-gray-800 border-none text-white mb-4"
        />

        <Text className="text-gray-400 text-sm mb-2">Avatar Seç</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mb-4">
            {EMOJIS.map(e => (
                <TouchableOpacity
                    key={e}
                    onPress={() => setUserAvatar(e)}
                    className={`w-12 h-12 rounded-full items-center justify-center mr-2 border-2 ${userAvatar === e ? 'border-primary bg-primary/20' : 'border-transparent bg-gray-800'}`}
                >
                    <Text className="text-2xl">{e}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>

        <Text className="text-gray-400 text-sm mb-2">AI Lakabı</Text>
        <Input
            value={aiNickname}
            onChangeText={setAiNickname}
            className="bg-gray-800 border-none text-white"
        />
      </Card>

      <Text className="text-gray-400 font-bold mb-4 uppercase text-xs tracking-widest">İstatistikler</Text>
      <View className="flex-row space-x-4 mb-8">
        <Card className="flex-1 bg-gray-900 border-none p-4 items-center">
            <MessageSquare color="#7c3aed" size={24} />
            <Text className="text-white text-xl font-bold mt-2">{totalMessages}</Text>
            <Text className="text-gray-500 text-xs">Toplam Mesaj</Text>
        </Card>
        <Card className="flex-1 bg-gray-900 border-none p-4 items-center">
            <List color="#7c3aed" size={24} />
            <Text className="text-white text-xl font-bold mt-2">{conversations.length}</Text>
            <Text className="text-gray-500 text-xs">Toplam Sohbet</Text>
        </Card>
      </View>

      <Button
        variant="flat"
        color="danger"
        onPress={handleDeleteAll}
        className="mb-12"
      >
        <Trash2 color="#ef4444" size={20} className="mr-2" />
        <Text className="text-red-500 font-bold ml-2">Hesabı ve Verileri Sil</Text>
      </Button>
    </ScrollView>
  );
}
