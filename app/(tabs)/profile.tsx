import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, Dimensions } from "react-native";
import { Avatar, Input, Button, Card } from "heroui-native";
import { User, Edit2, MessageSquare, List, Trash2, Shield, Heart, Award, ChevronRight } from "lucide-react-native";
import { useSettings } from "../../context/SettingsContext";
import { useChat } from "../../context/ChatContext";
import { LinearGradient } from "expo-linear-gradient";

const EMOJIS = ["👤", "🤖", "🐱", "🐶", "🦊", "🦁", "🐧", "🦄", "🌈", "🔥", "⚡", "💎"];

export default function ProfileScreen() {
  const { userName, setUserName, userAvatar, setUserAvatar, aiNickname, setAiNickname } = useSettings();
  const { conversations, clearHistory } = useChat();

  const totalMessages = conversations.reduce((acc, curr) => acc + curr.messages.length, 0);

  const handleDeleteAll = () => {
    Alert.alert("Hesabı Sıfırla", "Tüm verileriniz kalıcı olarak silinecek. Bu işlem geri alınamaz.", [
        { text: "Vazgeç", style: "cancel" },
        { text: "Verileri Sil", style: "destructive", onPress: clearHistory }
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-black" showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#1a1033', '#000000']}
        className="pt-12 pb-10 px-6 items-center"
      >
        <View className="relative">
            <LinearGradient
                colors={['#7c3aed', '#db2777']}
                className="p-1 rounded-full shadow-2xl"
            >
                <Avatar className="w-28 h-28 bg-surface rounded-full flex items-center justify-center border-4 border-black">
                    <Text className="text-6xl">{userAvatar}</Text>
                </Avatar>
            </LinearGradient>
            <TouchableOpacity className="absolute bottom-0 right-0 bg-primary p-2 rounded-full border-4 border-black">
                <Edit2 color="white" size={16} />
            </TouchableOpacity>
        </View>

        <Text className="text-white text-3xl font-black mt-4">{userName}</Text>
        <Text className="text-primary-400 font-bold uppercase tracking-[2px] text-xs mt-1">GELİŞMİŞ KULLANICI</Text>
      </LinearGradient>

      <View className="p-6">
        <View className="flex-row space-x-4 mb-10">
            <Card className="flex-1 bg-surface border border-white/5 p-5 items-center rounded-3xl">
                <View className="bg-primary/10 p-3 rounded-2xl">
                    <MessageSquare color="#7c3aed" size={24} />
                </View>
                <Text className="text-white text-2xl font-black mt-3">{totalMessages}</Text>
                <Text className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">TOPLAM MESAJ</Text>
            </Card>
            <Card className="flex-1 bg-surface border border-white/5 p-5 items-center rounded-3xl">
                <View className="bg-blue-500/10 p-3 rounded-2xl">
                    <List color="#3b82f6" size={24} />
                </View>
                <Text className="text-white text-2xl font-black mt-3">{conversations.length}</Text>
                <Text className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">SOHBETLER</Text>
            </Card>
        </View>

        <Text className="text-primary-400 font-bold mb-4 uppercase text-[10px] tracking-[3px]">PROFİL AYARLARI</Text>
        <Card className="bg-surface border border-white/5 p-6 mb-10 rounded-3xl">
            <View className="mb-6">
                <Text className="text-gray-500 text-xs font-bold uppercase mb-3 ml-1">KULLANICI ADI</Text>
                <Input
                    value={userName}
                    onChangeText={setUserName}
                    className="bg-black/40 border border-white/5 text-white p-4 rounded-2xl"
                    placeholder="Adınız..."
                />
            </View>

            <View className="mb-6">
                <Text className="text-gray-500 text-xs font-bold uppercase mb-3 ml-1">AVATAR SEÇİMİ</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                    {EMOJIS.map(e => (
                        <TouchableOpacity
                            key={e}
                            onPress={() => setUserAvatar(e)}
                            className={`w-14 h-14 rounded-2xl items-center justify-center mr-3 border-2 ${userAvatar === e ? 'border-primary bg-primary/20' : 'border-white/5 bg-black/40'}`}
                        >
                            <Text className="text-3xl">{e}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View>
                <Text className="text-gray-500 text-xs font-bold uppercase mb-3 ml-1">AI LAKABI</Text>
                <Input
                    value={aiNickname}
                    onChangeText={setAiNickname}
                    className="bg-black/40 border border-white/5 text-white p-4 rounded-2xl"
                    placeholder="Yapay Zeka adı..."
                />
            </View>
        </Card>

        <TouchableOpacity
            onPress={handleDeleteAll}
            className="flex-row items-center justify-between p-6 bg-red-500/10 rounded-3xl border border-red-500/20 mb-10"
        >
            <View className="flex-row items-center">
                <Shield color="#ef4444" size={24} className="mr-4" />
                <View>
                    <Text className="text-white font-bold text-base">Güvenli Temizlik</Text>
                    <Text className="text-red-500/60 text-xs">Tüm geçmişi ve ayarları sil</Text>
                </View>
            </View>
            <ChevronRight color="#ef4444" size={20} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
