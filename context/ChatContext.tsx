import React, { createContext, useContext, useState, useEffect } from "react";
import { storage, STORAGE_KEYS } from "../lib/storage";
import { Conversation, Message } from "../lib/api";

interface ChatContextType {
  conversations: Conversation[];
  currentChat: Conversation | null;
  startNewChat: () => void;
  loadChat: (id: string) => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  deleteMessage: (conversationId: string, messageId: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  isTyping: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentChat, setCurrentChat] = useState<Conversation | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    const saved = await storage.get<Conversation[]>(STORAGE_KEYS.CONVERSATIONS);
    if (saved) {
      setConversations(saved);
      const lastChatId = await storage.get<string>(STORAGE_KEYS.CURRENT_CHAT_ID);
      if (lastChatId) {
        const lastChat = saved.find(c => c.id === lastChatId);
        if (lastChat) setCurrentChat(lastChat);
      }
    }
  };

  const startNewChat = () => {
    const newChat: Conversation = {
      id: Date.now().toString(),
      title: "Yeni Sohbet",
      messages: [],
      updatedAt: new Date().toISOString(),
    };
    setConversations(prev => [newChat, ...prev]);
    setCurrentChat(newChat);
    storage.set(STORAGE_KEYS.CURRENT_CHAT_ID, newChat.id);
  };

  const loadChat = async (id: string) => {
    const chat = conversations.find(c => c.id === id);
    if (chat) {
      setCurrentChat(chat);
      storage.set(STORAGE_KEYS.CURRENT_CHAT_ID, id);
    }
  };

  const sendMessage = async (text: string) => {
    if (!currentChat) {
      // Create new chat if none exists
      const newChat: Conversation = {
        id: Date.now().toString(),
        title: text.substring(0, 30),
        messages: [],
        updatedAt: new Date().toISOString(),
      };
      // We will update it below
      setCurrentChat(newChat);
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text,
      timestamp: new Date().toISOString(),
    };

    const activeChat = currentChat || {
        id: Date.now().toString(),
        title: text.substring(0, 30),
        messages: [],
        updatedAt: new Date().toISOString(),
    };

    const updatedMessages = [...activeChat.messages, userMsg];
    const updatedChat = {
        ...activeChat,
        messages: updatedMessages,
        title: activeChat.messages.length === 0 ? text.substring(0, 30) : activeChat.title,
        updatedAt: new Date().toISOString()
    };

    setCurrentChat(updatedChat);
    updateConversations(updatedChat);

    // AI Response
    setIsTyping(true);
    try {
      const { fetchAIReply } = await import("../lib/api");
      const customPrompt = await storage.get<string>(STORAGE_KEYS.CUSTOM_PROMPT) || "";
      const aiReplyText = await fetchAIReply(text, customPrompt);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: aiReplyText,
        timestamp: new Date().toISOString(),
      };

      const finalChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, aiMsg],
        updatedAt: new Date().toISOString()
      };

      setCurrentChat(finalChat);
      updateConversations(finalChat);
    } catch (error: any) {
        // Handle error by showing a message (maybe Toast?)
        console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const deleteMessage = async (conversationId: string, messageId: string) => {
    setConversations(prev => {
      const chat = prev.find(c => c.id === conversationId);
      if (!chat) return prev;

      const updatedMessages = chat.messages.filter(m => m.id !== messageId);
      const updatedChat = { ...chat, messages: updatedMessages };

      if (currentChat?.id === conversationId) {
        setCurrentChat(updatedChat);
      }

      const newList = prev.map(c => c.id === conversationId ? updatedChat : c);
      storage.set(STORAGE_KEYS.CONVERSATIONS, newList);
      return newList;
    });
  };

  const updateConversations = (chat: Conversation) => {
    setConversations(prev => {
      const filtered = prev.filter(c => c.id !== chat.id);
      const newList = [chat, ...filtered];
      storage.set(STORAGE_KEYS.CONVERSATIONS, newList);
      return newList;
    });
  };

  const deleteConversation = async (id: string) => {
    const newList = conversations.filter(c => c.id !== id);
    setConversations(newList);
    storage.set(STORAGE_KEYS.CONVERSATIONS, newList);
    if (currentChat?.id === id) {
      setCurrentChat(null);
      storage.remove(STORAGE_KEYS.CURRENT_CHAT_ID);
    }
  };

  const clearHistory = async () => {
    setConversations([]);
    setCurrentChat(null);
    storage.remove(STORAGE_KEYS.CONVERSATIONS);
    storage.remove(STORAGE_KEYS.CURRENT_CHAT_ID);
  };

  return (
    <ChatContext.Provider value={{
      conversations, currentChat, startNewChat, loadChat, sendMessage, deleteConversation, deleteMessage, clearHistory, isTyping
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
};
