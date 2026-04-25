import React from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { Card, Button, Badge, Avatar } from "heroui-native";
import { Trash2, MessageSquare, Plus, Calendar, ChevronRight } from "lucide-react-native";
import { useChat } from "../../context/ChatContext";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function HistoryScreen() {
  const { conversations, loadChat, deleteConversation, startNewChat } = useChat();
  const router = useRouter();

  const handleSelect = (id: string) => {
    loadChat(id);
    router.push("/");
  };

  const handleDelete = (id: string) => {
    Alert.alert("Sohbeti Sil", "Bu görüşme kalıcı olarak silinsin mi?", [
      { text: "Vazgeç", style: "cancel" },
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
      { title: "BUGÜN", data: today },
      { title: "BU HAFTA", data: thisWeek },
      { title: "DAHA ÖNCE", data: older }
    ].filter(g => g.data.length > 0);
  };

  const groups = groupConversations();

  return (
    <View className="flex-1 bg-black p-4">
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
            startNewChat();
            router.push("/");
        }}
        className="mb-6 overflow-hidden rounded-2xl"
      >
        <LinearGradient
            colors={['#7c3aed', '#4c1d95']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="p-4 flex-row items-center justify-between"
        >
            <View className="flex-row items-center">
                <View className="bg-white/20 p-2 rounded-xl mr-3">
                    <Plus color="white" size={20} />
                </View>
                <Text className="text-white font-bold text-lg">Yeni Sohbet Başlat</Text>
            </View>
            <ChevronRight color="white/50" size={20} />
        </LinearGradient>
      </TouchableOpacity>

      {conversations.length === 0 ? (
        <View className="flex-1 items-center justify-center">
            <View className="bg-white/5 p-8 rounded-full mb-6">
                <MessageSquare color="#374151" size={60} />
            </View>
            <Text className="text-white font-bold text-xl mb-2">Henüz Sohbet Yok</Text>
            <Text className="text-gray-500 text-center px-8">Yapay zeka ile konuşmaya başlamak için yukarıdaki butona tıklayın.</Text>
        </View>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.title}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="mb-6">
              <View className="flex-row items-center mb-4">
                  <Calendar color="#7c3aed" size={14} className="mr-2" />
                  <Text className="text-primary-400 font-bold uppercase text-[10px] tracking-[2px]">{item.title}</Text>
                  <View className="flex-1 h-[1px] bg-white/5 ml-3" />
              </View>
              {item.data.map((chat: any) => (
                <TouchableOpacity key={chat.id} onPress={() => handleSelect(chat.id)} activeOpacity={0.7} className="mb-3">
                  <Card className="bg-surface border border-white/5 p-4 flex-row justify-between items-center shadow-sm">
                    <View className="flex-1 mr-4">
                      <Text className="text-white font-semibold text-base mb-1" numberOfLines={1}>
                        {chat.title || "Yeni Sohbet"}
                      </Text>
                      <View className="flex-row items-center">
                        <Text className="text-gray-600 text-xs mr-3">
                          {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                        <View className="bg-primary/10 px-2 py-0.5 rounded-md">
                            <Text className="text-[10px] text-primary-400 font-bold uppercase">{chat.messages.length} MESAJ</Text>
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => handleDelete(chat.id)}
                        className="p-2 bg-red-500/5 rounded-xl border border-red-500/10"
                    >
                        <Trash2 color="#ef4444" size={18} />
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
