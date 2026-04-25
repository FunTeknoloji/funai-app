import React, { useState, useRef } from "react";
import { View, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity, Text, Modal, Pressable, StyleSheet, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Input, Button, Card, Avatar } from "heroui-native";
import { Send, Mic, Trash2, MoreVertical, Copy, RotateCcw, X, AlertCircle, MessageCircle } from "lucide-react-native";
import { useChat } from "../../context/ChatContext";
import { useSettings } from "../../context/SettingsContext";
import { MessageBubble } from "../../components/MessageBubble";
import { TypingIndicator } from "../../components/TypingIndicator";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function ChatScreen() {
  const { currentChat, sendMessage, isTyping, clearHistory, deleteMessage } = useChat();
  const { aiNickname } = useSettings();
  const [inputText, setInputText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const handleSend = async () => {
    if (inputText.trim() === "") return;
    const text = inputText;
    setInputText("");
    await sendMessage(text);
  };

  const handleLongPress = (message: any) => {
    Alert.alert(
      "İşlemler",
      "Mesaj için bir eylem seçin",
      [
        { text: "Kopyala", onPress: () => Clipboard.setStringAsync(message.text) },
        { text: "Yeniden Sor", onPress: () => setInputText(message.text) },
        { text: "Sil", style: "destructive", onPress: () => currentChat && deleteMessage(currentChat.id, message.id) },
        { text: "Vazgeç", style: "cancel" }
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      style={styles.container}
    >
      <LinearGradient
        colors={['#1a1033', '#000000']}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={styles.header}
      >
        <View style={styles.headerLeft}>
            <View style={styles.avatarContainer}>
                <Avatar style={styles.avatar} color="primary">
                    <Text style={styles.avatarEmoji}>🤖</Text>
                </Avatar>
                <View style={styles.onlineStatus} />
            </View>
            <View style={styles.headerTextContainer}>
                <Text style={styles.aiName}>{aiNickname}</Text>
                <View style={styles.statusRow}>
                    <View style={[styles.statusDot, { backgroundColor: isTyping ? '#a78bfa' : '#22c55e' }]} />
                    <Text style={styles.statusText}>
                        {isTyping ? 'Düşünüyor...' : 'Çevrimiçi'}
                    </Text>
                </View>
            </View>
        </View>
        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          style={styles.headerAction}
        >
          <Trash2 color="#ef4444" size={20} />
        </TouchableOpacity>
      </LinearGradient>

      <FlatList
        ref={flatListRef}
        data={currentChat?.messages || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageBubble message={item} onLongPress={handleLongPress} />
        )}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={isTyping ? <TypingIndicator /> : null}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <MessageCircle color="#1a1a1a" size={100} />
                <Text style={styles.emptyTitle}>Sohbet Boş</Text>
                <Text style={styles.emptySubtitle}>Yapay zekaya bir şeyler sorarak başla!</Text>
            </View>
        }
      />

      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <View style={styles.inputInner}>
            <Input
                placeholder="Bir mesaj gönder..."
                value={inputText}
                onChangeText={setInputText}
                variant="bordered"
                style={styles.input}
                multiline
            />
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
                onPress={() => router.push("/voice")}
                style={styles.voiceButton}
            >
                <Mic color="#7c3aed" size={24} />
            </TouchableOpacity>
            <Button
                onPress={handleSend}
                style={styles.sendButton}
                color="primary"
            >
                <Send color="white" size={20} />
            </Button>
          </View>
        </View>
      </View>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
            <Card style={styles.modalCard}>
                <View style={styles.modalIcon}>
                    <AlertCircle color="#ef4444" size={40} />
                </View>
                <Text style={styles.modalTitle}>Sohbeti Temizle</Text>
                <Text style={styles.modalText}>
                    Tüm mesaj geçmişini silmek istediğine emin misin?
                </Text>
                <View style={styles.modalButtons}>
                    <Button
                        variant="flat"
                        style={styles.modalButton}
                        onPress={() => setIsModalVisible(false)}
                    >
                        <Text style={{ color: 'white' }}>İptal</Text>
                    </Button>
                    <Button
                        color="danger"
                        style={styles.modalButton}
                        onPress={() => {
                            clearHistory();
                            setIsModalVisible(false);
                        }}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Evet, Sil</Text>
                    </Button>
                </View>
            </Card>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.3)',
  },
  avatarEmoji: {
    fontSize: 24,
  },
  onlineStatus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#000000',
  },
  headerTextContainer: {
    marginLeft: 12,
  },
  aiName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    color: '#a78bfa',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerAction: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  emptySubtitle: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  inputWrapper: {
    padding: 20,
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#0a0a0a',
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  inputInner: {
    flex: 1,
  },
  input: {
    color: 'white',
    fontSize: 16,
    minHeight: 44,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    minWidth: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#111',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modalIcon: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 20,
    borderRadius: 30,
    marginBottom: 20,
  },
  modalTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 10,
  },
  modalText: {
    color: '#888',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 30,
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
  }
});
