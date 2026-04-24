import React from "react";
import { View, Text, ScrollView, Switch, TouchableOpacity } from "react-native";
import { Slider, Input, Button } from "heroui-native";
import { Moon, Sun, Monitor, Languages, MessageSquareCode, Trash2 } from "lucide-react-native";
import { useSettings } from "../../context/SettingsContext";
import { useChat } from "../../context/ChatContext";

export default function SettingsScreen() {
  const {
    theme, setTheme, ttsEnabled, setTtsEnabled, ttsSpeed, setTtsSpeed,
    ttsPitch, setTtsPitch, voiceLang, setVoiceLang, customPrompt, setCustomPrompt
  } = useSettings();
  const { clearHistory } = useChat();

  return (
    <ScrollView className="flex-1 bg-black p-4">
      <Text className="text-gray-400 font-bold mb-4 uppercase text-xs tracking-widest">Görünüm</Text>
      <View className="flex-row space-x-2 mb-8">
        {(["light", "dark", "system"] as const).map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTheme(t)}
            className={`flex-1 p-3 rounded-xl items-center border ${theme === t ? 'border-primary bg-primary/10' : 'border-gray-800 bg-gray-900'}`}
          >
            {t === 'light' && <Sun color={theme === t ? '#7c3aed' : '#9ca3af'} size={20} />}
            {t === 'dark' && <Moon color={theme === t ? '#7c3aed' : '#9ca3af'} size={20} />}
            {t === 'system' && <Monitor color={theme === t ? '#7c3aed' : '#9ca3af'} size={20} />}
            <Text className={`mt-1 text-xs capitalize ${theme === t ? 'text-primary' : 'text-gray-400'}`}>
                {t === 'light' ? 'Açık' : t === 'dark' ? 'Koyu' : 'Sistem'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text className="text-gray-400 font-bold mb-4 uppercase text-xs tracking-widest">Sesli Yanıt (TTS)</Text>
      <View className="bg-gray-900 rounded-2xl p-4 mb-8">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white text-base">Metinden Sese (TTS)</Text>
          <Switch value={ttsEnabled} onValueChange={setTtsEnabled} trackColor={{ true: '#7c3aed' }} />
        </View>

        <Text className="text-gray-400 text-sm mb-2">Konuşma Hızı: {ttsSpeed.toFixed(1)}x</Text>
        <Slider
          value={ttsSpeed}
          onValueChange={setTtsSpeed}
          minValue={0.5}
          maxValue={2.0}
          step={0.1}
          className="mb-4"
        />

        <Text className="text-gray-400 text-sm mb-2">Ses Tonu (Pitch): {ttsPitch.toFixed(1)}</Text>
        <Slider
          value={ttsPitch}
          onValueChange={setTtsPitch}
          minValue={0.5}
          maxValue={2.0}
          step={0.1}
        />
      </View>

      <Text className="text-gray-400 font-bold mb-4 uppercase text-xs tracking-widest">Yapay Zeka Talimatları</Text>
      <View className="bg-gray-900 rounded-2xl p-4 mb-8">
        <View className="flex-row items-center mb-2">
            <MessageSquareCode color="#7c3aed" size={18} className="mr-2" />
            <Text className="text-white text-base ml-2">Özel Sistem Promptu</Text>
        </View>
        <Input
          multiline
          numberOfLines={4}
          value={customPrompt}
          onChangeText={setCustomPrompt}
          placeholder="Örn: Bir komedyen gibi davran..."
          className="bg-gray-800 border-none text-white p-3 rounded-xl"
          placeholderTextColor="#4b5563"
        />
        <Text className="text-gray-500 text-[10px] mt-2">Bu metin her mesajın başına eklenerek AI'ya karakter verir.</Text>
      </View>

      <Button
        variant="flat"
        color="danger"
        onPress={clearHistory}
        className="mb-12"
      >
        <Trash2 color="#ef4444" size={20} className="mr-2" />
        <Text className="text-red-500 font-bold ml-2">Tüm Verileri Sıfırla</Text>
      </Button>
    </ScrollView>
  );
}
