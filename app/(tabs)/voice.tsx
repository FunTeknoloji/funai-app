import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Button } from "heroui-native";
import { Mic, MessageSquare, X } from "lucide-react-native";
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from "@react-native-voice/voice";
import * as Speech from "expo-speech";
import { useChat } from "../../context/ChatContext";
import { useSettings } from "../../context/SettingsContext";
import { VoiceWave } from "../../components/VoiceWave";
import { useRouter } from "expo-router";

export default function VoiceScreen() {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const { sendMessage, isTyping, currentChat } = useChat();
  const { ttsEnabled, ttsSpeed, ttsPitch, voiceLang } = useSettings();
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

  // Listen for AI replies to speak them
  useEffect(() => {
    const lastMessage = currentChat?.messages[currentChat.messages.length - 1];
    if (lastMessage && lastMessage.role === "ai" && ttsEnabled) {
      Speech.speak(lastMessage.text, {
        language: voiceLang,
        pitch: ttsPitch,
        rate: ttsSpeed,
        onDone: () => {
            // "dinle → gönder → sesli yanıt → tekrar dinle" döngüsü
            startListening();
        }
      });
    }
  }, [currentChat?.messages.length]);

  return (
    <View className="flex-1 bg-black items-center justify-center p-6">
      <View className="flex-1 justify-center items-center w-full">
        <VoiceWave isActive={isListening || isTyping} />

        <Text className="text-gray-400 text-lg mt-8 text-center px-4">
          {isListening ? "Dinliyorum..." : isTyping ? "AI Düşünüyor..." : "Başlamak için mikrofona basın"}
        </Text>

        {recognizedText ? (
           <Text className="text-white text-xl mt-4 text-center font-semibold">{recognizedText}</Text>
        ) : null}
      </View>

      <TouchableOpacity
        onPress={isListening ? stopListening : startListening}
        className={`w-24 h-24 rounded-full items-center justify-center mb-12 ${isListening ? 'bg-red-500' : 'bg-primary'}`}
      >
        <Mic color="white" size={40} />
      </TouchableOpacity>

      <Button
        variant="ghost"
        onPress={() => router.push("/")}
        className="mb-8"
      >
        <MessageSquare color="#7c3aed" size={20} className="mr-2" />
        <Text className="text-primary font-bold ml-2">Metin Moduna Geç</Text>
      </Button>
    </View>
  );
}
