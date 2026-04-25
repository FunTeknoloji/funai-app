import React from "react";
import { View, Text, ScrollView, Switch, TouchableOpacity } from "react-native";
import { Slider, Card, Button } from "heroui-native";
import { Moon, Sun, Monitor, Languages, MessageSquareCode, Trash2, Volume2, Gauge, Zap, ChevronRight } from "lucide-react-native";
import { useSettings } from "../../context/SettingsContext";
import { useChat } from "../../context/ChatContext";
import { LinearGradient } from "expo-linear-gradient";

export default function SettingsScreen() {
  const {
    theme, setTheme, ttsEnabled, setTtsEnabled, ttsSpeed, setTtsSpeed,
    ttsPitch, setTtsPitch, voiceLang, setVoiceLang, customPrompt, setCustomPrompt
  } = useSettings();
  const { clearHistory } = useChat();

  return (
    <ScrollView className="flex-1 bg-black" showsVerticalScrollIndicator={false}>
      <View className="p-6">
        <Text className="text-primary-400 font-bold mb-4 uppercase text-[10px] tracking-[3px]">GÖRÜNÜM TEMASI</Text>
        <View className="flex-row space-x-3 mb-10">
            {(["light", "dark", "system"] as const).map((t) => (
            <TouchableOpacity
                key={t}
                onPress={() => setTheme(t)}
                className={`flex-1 overflow-hidden rounded-2xl border-2 ${theme === t ? 'border-primary' : 'border-white/5'}`}
            >
                <View className={`p-4 items-center ${theme === t ? 'bg-primary/10' : 'bg-surface'}`}>
                    {t === 'light' && <Sun color={theme === t ? '#7c3aed' : '#444'} size={24} />}
                    {t === 'dark' && <Moon color={theme === t ? '#7c3aed' : '#444'} size={24} />}
                    {t === 'system' && <Monitor color={theme === t ? '#7c3aed' : '#444'} size={24} />}
                    <Text className={`mt-2 text-xs font-bold ${theme === t ? 'text-white' : 'text-gray-600'}`}>
                        {t === 'light' ? 'AÇIK' : t === 'dark' ? 'KOYU' : 'SİSTEM'}
                    </Text>
                </View>
            </TouchableOpacity>
            ))}
        </View>

        <Text className="text-primary-400 font-bold mb-4 uppercase text-[10px] tracking-[3px]">SESLİ ASİSTAN (TTS)</Text>
        <Card className="bg-surface border border-white/5 p-5 mb-10 rounded-3xl">
            <View className="flex-row justify-between items-center mb-6">
                <View className="flex-row items-center">
                    <View className="bg-primary/20 p-2 rounded-xl mr-3">
                        <Volume2 color="#7c3aed" size={20} />
                    </View>
                    <Text className="text-white font-semibold text-base">Sesli Yanıt</Text>
                </View>
                <Switch
                    value={ttsEnabled}
                    onValueChange={setTtsEnabled}
                    trackColor={{ false: '#222', true: '#7c3aed' }}
                    thumbColor="#fff"
                />
            </View>

            <View className="mb-6">
                <View className="flex-row justify-between items-center mb-3">
                    <View className="flex-row items-center">
                        <Gauge color="#666" size={16} className="mr-2" />
                        <Text className="text-gray-400 text-sm ml-2">Konuşma Hızı</Text>
                    </View>
                    <Text className="text-primary-400 font-bold">{ttsSpeed.toFixed(1)}x</Text>
                </View>
                <Slider
                    value={ttsSpeed}
                    onValueChange={setTtsSpeed}
                    minValue={0.5}
                    maxValue={2.0}
                    step={0.1}
                />
            </View>

            <View>
                <View className="flex-row justify-between items-center mb-3">
                    <View className="flex-row items-center">
                        <Zap color="#666" size={16} className="mr-2" />
                        <Text className="text-gray-400 text-sm ml-2">Ses Tonu (Pitch)</Text>
                    </View>
                    <Text className="text-primary-400 font-bold">{ttsPitch.toFixed(1)}</Text>
                </View>
                <Slider
                    value={ttsPitch}
                    onValueChange={setTtsPitch}
                    minValue={0.5}
                    maxValue={2.0}
                    step={0.1}
                />
            </View>
        </Card>

        <Text className="text-primary-400 font-bold mb-4 uppercase text-[10px] tracking-[3px]">ZEKA YAPILANDIRMASI</Text>
        <Card className="bg-surface border border-white/5 p-5 mb-10 rounded-3xl">
            <View className="flex-row items-center mb-4">
                <View className="bg-blue-500/20 p-2 rounded-xl mr-3">
                    <MessageSquareCode color="#3b82f6" size={20} />
                </View>
                <Text className="text-white font-semibold text-base">Sistem Talimatı (Prompt)</Text>
            </View>
            <View className="bg-black/40 rounded-2xl p-2 border border-white/5">
                <View className="h-32">
                    <ScrollView nestedScrollEnabled className="p-2">
                        <Text className="text-gray-300 text-sm leading-relaxed">
                            {customPrompt || "Örn: Bir komedyen gibi davran, espriler yap..."}
                        </Text>
                    </ScrollView>
                </View>
            </View>
            <TouchableOpacity
                className="mt-4 bg-white/5 p-3 rounded-xl items-center border border-white/5"
                onPress={() => {
                    // Prompt editing logic could be a modal
                }}
            >
                <Text className="text-primary-400 font-bold text-xs uppercase tracking-widest">TALİMATI GÜNCELLE</Text>
            </TouchableOpacity>
        </Card>

        <TouchableOpacity
            onPress={clearHistory}
            className="bg-red-500/10 border border-red-500/20 p-5 rounded-3xl flex-row items-center justify-center mb-10"
        >
            <Trash2 color="#ef4444" size={20} className="mr-3" />
            <Text className="text-red-500 font-bold">TÜM VERİLERİ SIFIRLA</Text>
        </TouchableOpacity>

        <View className="items-center pb-10">
            <Text className="text-gray-700 text-[10px] tracking-[4px] font-bold">FUNAI v1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
}
