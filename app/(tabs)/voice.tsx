import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Button, Avatar } from "heroui-native";
import { Mic, MessageSquare, X, ChevronLeft } from "lucide-react-native";
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from "@react-native-voice/voice";
import * as Speech from "expo-speech";
import { useChat } from "../../context/ChatContext";
import { useSettings } from "../../context/SettingsContext";
import { VoiceWave } from "../../components/VoiceWave";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function VoiceScreen() {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const { sendMessage, isTyping, currentChat } = useChat();
  const { ttsEnabled, ttsSpeed, ttsPitch, voiceLang, aiNickname } = useSettings();
  const router = useRouter();

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = () => setIsListening(true);
  const onSpeechEnd = () => setIsListening(false);
  const onSpeechError = (e: SpeechErrorEvent) => {
    console.error(e);
    setIsListening(false);
  };

  const onSpeechResults = (e: SpeechResultsEvent) => {
    if (e.value && e.value[0]) {
      const text = e.value[0];
      setRecognizedText(text);
      handleVoiceCommand(text);
    }
  };

  const startListening = async () => {
    try {
      setRecognizedText("");
      await Voice.start(voiceLang);
    } catch (e) {
      console.error(e);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  const handleVoiceCommand = async (text: string) => {
    await stopListening();
    await sendMessage(text);
  };

  useEffect(() => {
    const lastMessage = currentChat?.messages[currentChat.messages.length - 1];
    if (lastMessage && lastMessage.role === "ai" && ttsEnabled) {
      Speech.speak(lastMessage.text, {
        language: voiceLang,
        pitch: ttsPitch,
        rate: ttsSpeed,
        onDone: () => {
            startListening();
        }
      });
    }
  }, [currentChat?.messages.length]);

  return (
    <LinearGradient colors={['#1a1033', '#000000']} className="flex-1">
      <View className="flex-row justify-between items-center p-6">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/5 rounded-full">
              <ChevronLeft color="white" size={24} />
          </TouchableOpacity>
          <Text className="text-white font-bold text-lg">Sesli Asistan</Text>
          <View className="w-10" />
      </View>

      <View className="flex-1 items-center justify-center p-6">
        <View className="mb-12">
            <Avatar className="w-24 h-24 bg-primary/20 border-2 border-primary/40 shadow-2xl">
                <Text className="text-5xl">🤖</Text>
            </Avatar>
        </View>

        <VoiceWave isActive={isListening || isTyping} />

        <View className="mt-12 items-center">
            <Text className="text-primary-400 font-bold uppercase tracking-[4px] text-xs mb-4">
              {isListening ? "SENİ DİNLİYORUM" : isTyping ? "CEVAP HAZIRLANIYOR" : "BAŞLATMAK İÇİN DOKUN"}
            </Text>

            <View className="min-h-[100px] items-center justify-center px-6">
                {recognizedText ? (
                <Text className="text-white text-2xl text-center font-medium leading-relaxed">{recognizedText}</Text>
                ) : (
                <Text className="text-white/20 text-xl text-center italic">"Merhaba {aiNickname}..."</Text>
                )}
            </View>
        </View>
      </View>

      <View className="items-center pb-20">
        <TouchableOpacity
            onPress={isListening ? stopListening : startListening}
            activeOpacity={0.8}
            className={`w-28 h-28 rounded-full items-center justify-center shadow-2xl border-4 ${isListening ? 'bg-red-500 border-red-500/20' : 'bg-primary border-primary/20'}`}
        >
            <LinearGradient
                colors={isListening ? ['#ff4b2b', '#ff416c'] : ['#8b5cf6', '#7c3aed']}
                className="w-full h-full rounded-full items-center justify-center"
            >
                <Mic color="white" size={44} fill="rgba(255,255,255,0.2)" />
            </LinearGradient>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => router.push("/")}
        className="flex-row items-center justify-center mb-10 opacity-60"
      >
        <MessageSquare color="white" size={18} className="mr-2" />
        <Text className="text-white font-semibold ml-2">Klavye Moduna Dön</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}
