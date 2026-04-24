import React, { createContext, useContext, useState, useEffect } from "react";
import { storage, STORAGE_KEYS } from "../lib/storage";

interface SettingsContextType {
  theme: "light" | "dark" | "system";
  setTheme: (t: "light" | "dark" | "system") => void;
  userName: string;
  setUserName: (n: string) => void;
  userAvatar: string;
  setUserAvatar: (a: string) => void;
  ttsEnabled: boolean;
  setTtsEnabled: (b: boolean) => void;
  ttsSpeed: number;
  setTtsSpeed: (n: number) => void;
  ttsPitch: number;
  setTtsPitch: (n: number) => void;
  voiceLang: string;
  setVoiceLang: (l: string) => void;
  customPrompt: string;
  setCustomPrompt: (p: string) => void;
  aiNickname: string;
  setAiNickname: (n: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [userName, setUserName] = useState("Kullanıcı");
  const [userAvatar, setUserAvatar] = useState("👤");
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [ttsSpeed, setTtsSpeed] = useState(1.0);
  const [ttsPitch, setTtsPitch] = useState(1.0);
  const [voiceLang, setVoiceLang] = useState("tr-TR");
  const [customPrompt, setCustomPrompt] = useState("");
  const [aiNickname, setAiNickname] = useState("FunAI");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const t = await storage.get<"light" | "dark" | "system">(STORAGE_KEYS.THEME);
    if (t) setTheme(t);
    const un = await storage.get<string>(STORAGE_KEYS.USER_NAME);
    if (un) setUserName(un);
    const ua = await storage.get<string>(STORAGE_KEYS.USER_AVATAR);
    if (ua) setUserAvatar(ua);
    const te = await storage.get<boolean>(STORAGE_KEYS.TTS_ENABLED);
    if (te !== null) setTtsEnabled(te);
    const ts = await storage.get<number>(STORAGE_KEYS.TTS_SPEED);
    if (ts) setTtsSpeed(ts);
    const tp = await storage.get<number>(STORAGE_KEYS.TTS_PITCH);
    if (tp) setTtsPitch(tp);
    const vl = await storage.get<string>(STORAGE_KEYS.VOICE_LANG);
    if (vl) setVoiceLang(vl);
    const cp = await storage.get<string>(STORAGE_KEYS.CUSTOM_PROMPT);
    if (cp) setCustomPrompt(cp);
    const an = await storage.get<string>(STORAGE_KEYS.AI_NICKNAME);
    if (an) setAiNickname(an);
  };

  const updateSetting = (key: string, setter: any) => (value: any) => {
    setter(value);
    storage.set(key, value);
  };

  return (
    <SettingsContext.Provider value={{
      theme, setTheme: updateSetting(STORAGE_KEYS.THEME, setTheme),
      userName, setUserName: updateSetting(STORAGE_KEYS.USER_NAME, setUserName),
      userAvatar, setUserAvatar: updateSetting(STORAGE_KEYS.USER_AVATAR, setUserAvatar),
      ttsEnabled, setTtsEnabled: updateSetting(STORAGE_KEYS.TTS_ENABLED, setTtsEnabled),
      ttsSpeed, setTtsSpeed: updateSetting(STORAGE_KEYS.TTS_SPEED, setTtsSpeed),
      ttsPitch, setTtsPitch: updateSetting(STORAGE_KEYS.TTS_PITCH, setTtsPitch),
      voiceLang, setVoiceLang: updateSetting(STORAGE_KEYS.VOICE_LANG, setVoiceLang),
      customPrompt, setCustomPrompt: updateSetting(STORAGE_KEYS.CUSTOM_PROMPT, setCustomPrompt),
      aiNickname, setAiNickname: updateSetting(STORAGE_KEYS.AI_NICKNAME, setAiNickname),
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
};
