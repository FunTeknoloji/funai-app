export interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: string;
}

export const fetchAIReply = async (message: string, customPrompt?: string): Promise<string> => {
  try {
    const fullMessage = customPrompt ? `${customPrompt}\n\n${message}` : message;
    const encoded = encodeURIComponent(fullMessage);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    let lastError = null;
    for (let i = 0; i < 3; i++) {
      try {
        const response = await fetch(`https://text.pollinations.ai/${encoded}`, {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("API hatası");

        const text = await response.text();
        clearTimeout(timeoutId);
        return text;
      } catch (err) {
        lastError = err;
        if (i < 2) await new Promise(res => setTimeout(res, 1000));
      }
    }
    throw lastError;
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("İstek zaman aşımına uğradı.");
    }
    throw new Error("Bağlantı hatası oluştu. Lütfen internetinizi kontrol edin.");
  }
};
