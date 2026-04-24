import AsyncStorage from "@react-native-async-storage/async-storage";

export const STORAGE_KEYS = {
  CONVERSATIONS: "@funai/conversations",
  CURRENT_CHAT_ID: "@funai/current_chat",
  THEME: "@funai/theme",
  USER_NAME: "@funai/user_name",
  USER_AVATAR: "@funai/user_avatar",
  TTS_ENABLED: "@funai/tts_enabled",
  TTS_SPEED: "@funai/tts_speed",
  TTS_PITCH: "@funai/tts_pitch",
  VOICE_LANG: "@funai/voice_lang",
  CUSTOM_PROMPT: "@funai/custom_prompt",
  AI_NICKNAME: "@funai/ai_nickname",
};

export const storage = {
  async set(key: string, value: any) {
    try {
      const stringValue = typeof value === "string" ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, stringValue);
    } catch (e) {
      console.error("Storage error:", e);
    }
  },

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) return null;
      try {
        return JSON.parse(value) as T;
      } catch {
        return value as unknown as T;
      }
    } catch (e) {
      console.error("Storage error:", e);
      return null;
    }
  },

  async remove(key: string) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error("Storage error:", e);
    }
  },

  async clearAll() {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);
    } catch (e) {
      console.error("Storage error:", e);
    }
  },
};
