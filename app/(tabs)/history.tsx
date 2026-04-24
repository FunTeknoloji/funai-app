import React from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { Card, Button, Badge } from "heroui-native";
import { Trash2, MessageSquare, Plus } from "lucide-react-native";
import { useChat } from "../../context/ChatContext";
import { useRouter } from "expo-router";

export default function HistoryScreen() {
  const { conversations, loadChat, deleteConversation, startNewChat } = useChat();
  const router = useRouter();

  const handleSelect = (id: string) => {
    loadChat(id);
    router.push("/");
  };

  const handleDelete = (id: string) => {
    Alert.alert("Sil", "Bu sohbeti silmek istediğinize emin misiniz?", [
      { text: "İptal", style: "cancel" },
      { text: "Sil", style: "destructive", onPress: () => deleteConversation(id) }
    ]);
  };

  const groupConversations = () => {
    const today: any[] = [];
    const thisWeek: any[] = [];
    const older: any[] = [];

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    conversations.forEach(c => {
      const date = new Date(c.updatedAt);
      if (date.toDateString() === now.toDateString()) {
        today.push(c);
      } else if (date > oneWeekAgo) {
        thisWeek.push(c);
      } else {
        older.push(c);
      }
    });

    return [
      { title: "Bugün", data: today },
      { title: "Bu Hafta", data: thisWeek },
      { title: "Daha Önce", data: older }
    ].filter(g => g.data.length > 0);
  };

  const groups = groupConversations();

  return (
    <View className="flex-1 bg-black p-4">
      <Button
        variant="solid"
        color="primary"
        onPress={() => {
            startNewChat();
            router.push("/");
        }}
        className="mb-4"
      >
        <Plus color="white" size={20} className="mr-2" />
        <Text className="text-white font-bold ml-2">Yeni Sohbet Başlat</Text>
      </Button>

      {conversations.length === 0 ? (
        <View className="flex-1 items-center justify-center">
            <MessageSquare color="#374151" size={80} />
            <Text className="text-gray-500 mt-4 text-center">Henüz sohbet geçmişi yok.</Text>
        </View>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => (
            <View className="mb-6">
              <Text className="text-gray-400 font-bold mb-2 uppercase text-xs tracking-widest">{item.title}</Text>
              {item.data.map((chat: any) => (
                <TouchableOpacity key={chat.id} onPress={() => handleSelect(chat.id)} className="mb-3">
                  <Card className="bg-gray-900 border-none p-4 flex-row justify-between items-center">
                    <View className="flex-1">
                      <Text className="text-white font-bold text-base" numberOfLines={1}>
                        {chat.title || "Yeni Sohbet"}
                      </Text>
                      <View className="flex-row items-center mt-1">
                        <Text className="text-gray-500 text-xs mr-2">
                          {new Date(chat.updatedAt).toLocaleDateString()}
                        </Text>
                        <Badge variant="flat" color="primary" className="h-4">
                           <Text className="text-[10px] text-primary">{chat.messages.length} mesaj</Text>
                        </Badge>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => handleDelete(chat.id)} className="ml-4">
                        <Trash2 color="#ef4444" size={20} />
                    </TouchableOpacity>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          )}
        />
      )}
    </View>
  );
}
