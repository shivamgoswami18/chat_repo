import { useEffect, useRef, useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";
import { BaseURL } from "@/lib/api/ApiService";

// Get WebSocket URL from BaseURL
const getWebSocketURL = (): string => {
  if (typeof globalThis.window === "undefined") return "";
  
  // Convert https://prosjektmarkedet-be.onrender.com/api/ to wss://prosjektmarkedet-be.onrender.com
  // or ws:// for secure connections
  // Try to use environment variable first, otherwise derive from BaseURL
  const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
  if (wsUrl) {
    return wsUrl;
  }
  
  const baseUrl = BaseURL.replace("/api/", "").replace("https://", "wss://").replace("http://", "ws://");
  console.log("WebSocket URL:", baseUrl);
  return baseUrl;
};

export interface Message {
  _id: string;
  chat_id: string;
  sender_id: string;
  message: string;
  type: string;
  image?: string;
  status?: string;
  createdAt: string;
}

export interface UseChatSocketOptions {
  chatId: string | null;
  userId: string | null;
  onMessage?: (message: Message) => void;
  onHistory?: (messages: Message[]) => void;
  onTyping?: (userId: string) => void;
  onStoppedTyping?: (userId: string) => void;
  onDisconnected?: (clientId: string) => void;
}

export const useChatSocket = ({
  chatId,
  userId,
  onMessage,
  onHistory,
  onTyping,
  onStoppedTyping,
  onDisconnected,
}: UseChatSocketOptions) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Connect to socket
  const connect = useCallback(() => {
    if (!chatId || !userId) {
      console.log("Cannot connect: missing chatId or userId", { chatId, userId });
      setIsConnected(false);
      return;
    }

    if (socketRef.current?.connected) {
      console.log("Socket already connected");
      return;
    }

    const wsUrl = getWebSocketURL();
    if (!wsUrl) {
      console.error("WebSocket URL is not configured");
      setIsConnected(false);
      return;
    }

    console.log("Connecting to WebSocket:", wsUrl, "with chat_id:", chatId);

    // Disconnect existing socket if any
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    // Create new socket connection with chat_id as query param
    socketRef.current = io(wsUrl, {
      query: {
        chat_id: chatId,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    const socket = socketRef.current;

    // Connection event
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      setIsConnected(true);
    });

    // Disconnect event
    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    // User disconnected event
    socket.on("userDisconnected", (data: { clientId: string }) => {
      if (onDisconnected) {
        onDisconnected(data.clientId);
      }
    });

    // Receive message event
    socket.on("receivedMessage", (message: Message) => {
      console.log("Socket receivedMessage event:", message);
      if (onMessage) {
        onMessage(message);
      }
    });

    // Chat history event
    socket.on("chatHistory", (messages: Message[]) => {
      if (onHistory) {
        onHistory(messages);
      }
    });

    // User typing event
    socket.on("userTyping", (data: { sender: string }) => {
      if (onTyping && data.sender !== userId) {
        onTyping(data.sender);
      }
    });

    // User stopped typing event
    socket.on("userStoppedTyping", (data: { sender: string }) => {
      if (onStoppedTyping && data.sender !== userId) {
        onStoppedTyping(data.sender);
      }
    });

    // Error handling
    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setIsConnected(false);
    });
  }, [chatId, userId, onMessage, onHistory, onTyping, onStoppedTyping, onDisconnected]);

  // Disconnect socket
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  // Send message
  const sendMessage = useCallback(
    (message: string, type: string = "normal", image: string = "") => {
      if (!socketRef.current?.connected || !chatId || !userId) {
        console.error("Socket not connected or missing chatId/userId", {
          connected: socketRef.current?.connected,
          chatId,
          userId,
        });
        return false;
      }

      console.log("Sending message:", { chat_id: chatId, sender: userId, message, type, image });

      socketRef.current.emit("sendMessage", {
        chat_id: chatId,
        sender: userId,
        message,
        type,
        image,
      });

      console.log("Message sent successfully");
      return true;
    },
    [chatId, userId]
  );

  // Request chat history
  const requestChatHistory = useCallback(() => {
    if (!socketRef.current?.connected || !chatId) {
      console.error("Socket not connected or missing chatId");
      return;
    }

    socketRef.current.emit("chatHistory", { chat_id: chatId });
  }, [chatId]);

  // Send typing indicator
  const sendTyping = useCallback(() => {
    if (!socketRef.current?.connected || !chatId || !userId) {
      return;
    }

    socketRef.current.emit("userTyping", {
      chat_id: chatId,
      sender: userId,
    });
  }, [chatId, userId]);

  // Send stopped typing indicator
  const sendStoppedTyping = useCallback(() => {
    if (!socketRef.current?.connected || !chatId || !userId) {
      return;
    }

    socketRef.current.emit("userStoppedTyping", {
      chat_id: chatId,
      sender: userId,
    });
  }, [chatId, userId]);

  // Connect when chatId or userId changes
  useEffect(() => {
    if (chatId && userId) {
      connect();
    } else {
      setIsConnected(false);
    }

    return () => {
      disconnect();
    };
  }, [chatId, userId, connect, disconnect]);

  return {
    connect,
    disconnect,
    sendMessage,
    requestChatHistory,
    sendTyping,
    sendStoppedTyping,
    isConnected,
  };
};

