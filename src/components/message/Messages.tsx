"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import {
  SearchIcon,
  MicrophoneIcon,
  AttachmentIcon,
  ImageIcon,
  SendIcon,
  BackArrowIcon,
  CloseIcon,
} from "@/assets/icons/CommonIcons";
import user_image from "@/assets/images/user_dummy_image.png";
import BaseButton from "@/components/base/BaseButton";
import BaseInput from "@/components/base/BaseInput";
import BaseLoader from "@/components/base/BaseLoader";
import {
  useChatSocket,
  type Message as SocketMessage,
} from "@/lib/hooks/useChatSocket";
import {
  createChatSession,
  getChatList,
  type ChatContact,
} from "@/lib/api/ChatApi";
import { useAppDispatch } from "@/lib/store/hooks";
import { formatDistanceToNow, parseISO, format } from "date-fns";
import type { RootState } from "@/lib/store/store";
import { LIST_OF_RECEIVED_OFFER } from "@/lib/api/ApiRoutes";
import { authData, BaseURL } from "@/lib/api/ApiService";
import {
  checkStatusCodeSuccess,
  errorHandler,
} from "@/components/constants/Common";
import { io, Socket } from "socket.io-client";

interface Contact {
  id: string;
  chatId: string;
  name: string;
  lastMessage: string;
  avatar: string;
  unreadCount?: number;
  receiverId: string;
}

interface Message {
  id: string;
  text: string;
  isOutgoing: boolean;
  timestamp: string;
  createdAt?: string;
}

export default function Messages() {
  const dispatch = useAppDispatch();
  const userId = useSelector((state: RootState) => state.auth.id);
  const searchParams = useSearchParams();
  const businessIdFromUrl = searchParams.get("business_id");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(
    null
  );
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [allMessages, setAllMessages] = useState<Message[]>([]); // Store all messages for search highlighting
  const [messageText, setMessageText] = useState<string>("");
  const [showChatView, setShowChatView] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingChats, setLoadingChats] = useState<boolean>(true);
  const [sendingMessage, setSendingMessage] = useState<boolean>(false);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState<boolean>(false);
  const [tempBusinessData, setTempBusinessData] = useState<{
    business_id: string;
    business_name: string;
    business_image: string | null;
  } | null>(null);
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [contactSearchQuery, setContactSearchQuery] = useState<string>("");
  const [isContactSearchVisible, setIsContactSearchVisible] =
    useState<boolean>(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const contactSearchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const otherUserTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasProcessedBusinessIdRef = useRef<string | null>(null);
  const hasLoadedChatListRef = useRef<boolean>(false);
  const hasLoadedChatHistoryRef = useRef<string | null>(null);

  // Scroll to bottom
  const scrollToBottom = useCallback((instant: boolean = false) => {
    if (instant && messagesContainerRef.current) {
      // Instant jump with zero animation - directly set scrollTop
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        if (messagesContainerRef.current) {
          const container = messagesContainerRef.current;
          container.scrollTop = container.scrollHeight;
        }
      });
    } else if (messagesEndRef.current) {
      // Smooth scroll for new messages
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, []);

  // Get Redux state for projects and offers
  const receivedOffers = useSelector(
    (state: RootState) => state.project.receivedOffers
  );
  const currentProjectDetails = useSelector(
    (state: RootState) => state.project.currentProjectDetails
  );

  // Convert API message to UI message
  const convertSocketMessageToUIMessage = useCallback(
    (socketMessage: SocketMessage): Message => {
      const isOutgoing = socketMessage.sender_id === userId;
      const createdAt = socketMessage.createdAt
        ? parseISO(socketMessage.createdAt)
        : new Date();

      // If message is very recent (within last 2 minutes), show "Now"
      const now = new Date();
      const diffInSeconds = Math.floor(
        (now.getTime() - createdAt.getTime()) / 1000
      );
      let timestamp: string;

      if (diffInSeconds < 120) {
        // Less than 2 minutes old, show "Now"
        timestamp = "Now";
      } else {
        // Otherwise use formatDistanceToNow
        timestamp = formatDistanceToNow(createdAt, { addSuffix: true });
      }

      return {
        id: socketMessage._id,
        text: socketMessage.message || "",
        isOutgoing,
        timestamp,
        createdAt: socketMessage.createdAt,
      };
    },
    [userId]
  );

  // Load chat list
  const loadChatList = useCallback(
    async (search: string = "") => {
      if (hasLoadedChatListRef.current && !businessIdFromUrl && !search) {
        // Don't reload if already loaded and no business_id in URL and no search
        return;
      }

      setLoadingChats(true);
      try {
        const thunkResult = dispatch(
          getChatList({
            sortKey: "updatedAt",
            sortValue: "desc",
            page: 1,
            limit: 100,
            search: search,
          })
        );

        // The thunk returns a promise, await it
        const result = await thunkResult;

        if (result?.items && Array.isArray(result.items)) {
          const formattedContacts: Contact[] = result.items.map(
            (chat: ChatContact) => {
              // The API returns simplified structure: _id is chat_id, user_id is the other user
              // Use the new structure if available, otherwise fall back to old structure
              const chatId = chat._id; // _id is the chat_id
              const otherUserId =
                chat.user_id ||
                (chat.sender_id === userId ? chat.receiver_id : chat.sender_id);
              const otherUserName =
                chat.name ||
                (chat.sender_id === userId
                  ? chat.receiver?.full_name
                  : chat.sender?.full_name) ||
                "Unknown User";
              const otherUserImage =
                chat.profile_image ||
                (chat.sender_id === userId
                  ? chat.receiver?.profile_image
                  : chat.sender?.profile_image) ||
                user_image.src;
              const lastMessageText =
                chat.last_message ||
                chat.lastMessage?.message ||
                "No messages yet";

              return {
                id: chat._id,
                chatId: chatId,
                name: otherUserName,
                lastMessage: lastMessageText,
                avatar: otherUserImage || user_image.src,
                unreadCount: chat.unreadCount || 0,
                receiverId: otherUserId || "",
              };
            }
          );

          setContacts(formattedContacts);
          hasLoadedChatListRef.current = true;

          // If we have tempBusinessData and now found the contact in list, clear temp data
          if (tempBusinessData && businessIdFromUrl) {
            const foundContact = formattedContacts.find(
              (c) => c.receiverId === businessIdFromUrl
            );
            if (foundContact) {
              setTempBusinessData(null);
              // If chat is open with this business, update selectedContactId
              if (selectedChatId && !selectedContactId) {
                setSelectedContactId(foundContact.id);
              }
            }
          }
        } else {
          // If no data or empty response, set empty array
          setContacts([]);
          hasLoadedChatListRef.current = true;
        }
      } catch (error) {
        console.error("Failed to load chat list:", error);
      } finally {
        setLoadingChats(false);
      }
    },
    [
      dispatch,
      userId,
      businessIdFromUrl,
      tempBusinessData,
      selectedChatId,
      selectedContactId,
    ]
  );

  // Handle received message
  const handleReceivedMessage = useCallback(
    (socketMessage: SocketMessage) => {
      if (socketMessage.chat_id === selectedChatId) {
        const uiMessage = convertSocketMessageToUIMessage(socketMessage);

        // Remove any temporary optimistic messages with same text
        setMessages((prev) => {
          // Remove temp messages that match this one
          const filtered = prev.filter(
            (msg) =>
              !(
                msg.id.startsWith("temp-") &&
                msg.text === uiMessage.text &&
                msg.isOutgoing === uiMessage.isOutgoing
              )
          );

          // Check if message already exists (avoid duplicates)
          const exists = filtered.some((msg) => msg.id === uiMessage.id);
          if (exists) {
            return filtered;
          }

          return [...filtered, uiMessage];
        });

        // Also update allMessages
        setAllMessages((prev) => {
          const filtered = prev.filter(
            (msg) =>
              !(
                msg.id.startsWith("temp-") &&
                msg.text === uiMessage.text &&
                msg.isOutgoing === uiMessage.isOutgoing
              )
          );
          const exists = filtered.some((msg) => msg.id === uiMessage.id);
          if (exists) {
            return filtered;
          }
          return [...filtered, uiMessage];
        });
        scrollToBottom();
      }

      // Update contact list: move contact to top, update lastMessage, and increment unread count if not selected
      setContacts((prev) => {
        const contactIndex = prev.findIndex(
          (contact) => contact.chatId === socketMessage.chat_id
        );

        if (contactIndex === -1) {
          // Contact not found in list, return as is
          return prev;
        }

        // Get the contact
        const contact = prev[contactIndex];
        const isCurrentlySelected = socketMessage.chat_id === selectedChatId;

        // Update contact with new message and unread count
        const updatedContact: Contact = {
          ...contact,
          lastMessage: socketMessage.message || contact.lastMessage,
          // Increment unread count if this chat is not currently selected
          unreadCount: isCurrentlySelected
            ? 0 // Clear unread count if currently viewing this chat
            : (contact.unreadCount || 0) + 1,
        };

        // Remove contact from current position and add to top (like WhatsApp)
        const newContacts = [...prev];
        newContacts.splice(contactIndex, 1);
        return [updatedContact, ...newContacts];
      });
    },
    [selectedChatId, convertSocketMessageToUIMessage, scrollToBottom]
  );

  // Handle chat history
  const handleChatHistory = useCallback(
    (historyMessages: SocketMessage[]) => {
      // Mark that chat history has been loaded for this chatId
      if (selectedChatId) {
        hasLoadedChatHistoryRef.current = selectedChatId;
      }

      const uiMessages = historyMessages.map((msg) =>
        convertSocketMessageToUIMessage(msg)
      );

      // Sort by createdAt
      uiMessages.sort((a, b) => {
        const timeA = a.createdAt ? parseISO(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? parseISO(b.createdAt).getTime() : 0;
        return timeA - timeB;
      });

      // Store all messages and set current messages
      setAllMessages(uiMessages);
      setMessages(uiMessages);
      // Keep loading state until scroll completes - wait for DOM to render, then scroll instantly
      setTimeout(() => {
        scrollToBottom(true);
        // After scroll completes, hide loading
        setTimeout(() => {
          setLoading(false);
        }, 0);
      }, 0);
    },
    [convertSocketMessageToUIMessage, selectedChatId, scrollToBottom]
  );

  // Handle other user typing
  const handleOtherUserTyping = useCallback(() => {
    setIsOtherUserTyping(true);

    // Clear existing timeout
    if (otherUserTypingTimeoutRef.current) {
      clearTimeout(otherUserTypingTimeoutRef.current);
    }

    // Auto-hide typing indicator after 3 seconds if no stoppedTyping event received
    otherUserTypingTimeoutRef.current = setTimeout(() => {
      setIsOtherUserTyping(false);
    }, 3000);

    scrollToBottom();
  }, [scrollToBottom]);

  // Handle other user stopped typing
  const handleOtherUserStoppedTyping = useCallback(() => {
    setIsOtherUserTyping(false);

    // Clear timeout since we got explicit stoppedTyping event
    if (otherUserTypingTimeoutRef.current) {
      clearTimeout(otherUserTypingTimeoutRef.current);
      otherUserTypingTimeoutRef.current = null;
    }
  }, []);

  // WebSocket hook
  const {
    sendMessage: sendSocketMessage,
    requestChatHistory,
    sendTyping,
    sendStoppedTyping,
    isConnected,
  } = useChatSocket({
    chatId: selectedChatId,
    userId,
    onMessage: handleReceivedMessage,
    onHistory: handleChatHistory,
    onTyping: handleOtherUserTyping,
    onStoppedTyping: handleOtherUserStoppedTyping,
  });

  // Global WebSocket connections to listen to all chats
  const chatSocketsRef = useRef<Map<string, Socket>>(new Map());

  useEffect(() => {
    if (!userId || contacts.length === 0) return;

    // Capture ref value at the start to avoid stale closure
    const chatSockets = chatSocketsRef.current;
    const currentSelectedChatId = selectedChatId;

    // Get WebSocket URL
    const getWebSocketURL = (): string => {
      if (typeof globalThis.window === "undefined") return "";
      const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
      if (wsUrl) return wsUrl;
      const baseUrl = BaseURL.replace("/api/", "")
        .replace("https://", "wss://")
        .replace("http://", "ws://");
      return baseUrl;
    };

    const wsUrl = getWebSocketURL();
    if (!wsUrl) {
      console.error("WebSocket URL is not configured");
      return;
    }

    // Connect to all chats in the contact list
    contacts.forEach((contact) => {
      if (!contact.chatId) return;

      // Skip if already connected to this chat
      if (chatSockets.has(contact.chatId)) return;

      // Skip if this is the currently selected chat (it has its own connection)
      if (contact.chatId === currentSelectedChatId) return;

      // console.log("Connecting to chat for listening:", contact.chatId);

      // Create socket connection for this chat
      const socket = io(wsUrl, {
        query: {
          chat_id: contact.chatId,
        },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 20000,
      });

      // Store socket reference
      chatSockets.set(contact.chatId, socket);

      // Listen to messages from this chat
      socket.on("receivedMessage", (message: SocketMessage) => {
        // console.log("Received message from chat:", contact.chatId, message);
        // Handle message - this will update the contact list
        handleReceivedMessage(message);
      });

      socket.on("connect", () => {
        // console.log("Connected to chat for listening:", contact.chatId);
      });

      socket.on("connect_error", (error) => {
        console.error("Connection error for chat:", contact.chatId, error);
      });
    });

    // Cleanup: disconnect from chats that are no longer in the contact list
    const currentChatIds = new Set(
      contacts.map((c) => c.chatId).filter(Boolean)
    );
    chatSockets.forEach((socket, chatId) => {
      // Don't disconnect if it's the selected chat (handled by useChatSocket)
      if (chatId === currentSelectedChatId) return;

      // Disconnect if chat is no longer in contact list
      if (!currentChatIds.has(chatId)) {
        // console.log("Disconnecting from chat:", chatId);
        socket.disconnect();
        chatSockets.delete(chatId);
      }
    });

    return () => {
      // Cleanup on unmount - use captured variables
      const socketsToCleanup = new Map(chatSockets);

      socketsToCleanup.forEach((socket, chatId) => {
        // Don't disconnect the selected chat (handled by useChatSocket)
        if (chatId !== currentSelectedChatId) {
          socket.disconnect();
          chatSockets.delete(chatId);
        }
      });
    };
  }, [userId, contacts, selectedChatId, handleReceivedMessage]);

  // Load chat list on mount
  useEffect(() => {
    if (userId && !hasLoadedChatListRef.current) {
      loadChatList();
    }
  }, [userId, loadChatList]);

  // Fetch business data from Redux or API
  const fetchBusinessData = useCallback(
    async (businessId: string) => {
      // First try to get from Redux receivedOffers
      if (receivedOffers?.items && Array.isArray(receivedOffers.items)) {
        const businessOffer = receivedOffers.items.find(
          (offer) => offer.business_id === businessId
        );
        if (businessOffer?.business_id) {
          setTempBusinessData({
            business_id: businessOffer.business_id,
            business_name: businessOffer.business_name || "Business",
            business_image: businessOffer.business_image || null,
          });
          return;
        }
      }

      // If not found in Redux, try to fetch from API if we have project_id
      const projectId =
        currentProjectDetails?._id || searchParams.get("project_id");
      if (projectId && typeof projectId === "string") {
        try {
          const response = await authData.post(
            LIST_OF_RECEIVED_OFFER(projectId),
            {
              sortKey: "_id",
              sortValue: "desc",
              page: 1,
              limit: 100,
              search: "",
            }
          );
          const responseData = response?.data;
          if (checkStatusCodeSuccess(responseData?.statusCode)) {
            const items = responseData?.data?.items || [];
            interface BusinessOffer {
              business_id: string;
              business_name?: string;
              business_image?: string | null;
            }
            const businessOffer = items.find(
              (offer: BusinessOffer) => offer.business_id === businessId
            ) as BusinessOffer | undefined;
            if (businessOffer?.business_id) {
              setTempBusinessData({
                business_id: businessOffer.business_id,
                business_name: businessOffer.business_name || "Business",
                business_image: businessOffer.business_image || null,
              });
              return;
            }
          }
        } catch (error) {
          errorHandler(error);
        }
      }

      // If still not found, set default values
      setTempBusinessData({
        business_id: businessId,
        business_name: "Business",
        business_image: null,
      });
    },
    [receivedOffers, currentProjectDetails, searchParams]
  );

  // Handle business_id from URL - start chat with that business
  useEffect(() => {
    // Reset if business_id changed
    if (
      businessIdFromUrl &&
      hasProcessedBusinessIdRef.current !== businessIdFromUrl
    ) {
      hasProcessedBusinessIdRef.current = null;
      setTempBusinessData(null); // Clear previous temp data
    }

    const startChatWithBusiness = async () => {
      if (
        !businessIdFromUrl ||
        !userId ||
        loadingChats ||
        hasProcessedBusinessIdRef.current === businessIdFromUrl
      )
        return;

      // Mark as processed to prevent re-running
      hasProcessedBusinessIdRef.current = businessIdFromUrl;

      // Check if contact already exists in the list (match by receiverId which is user_id from API)
      const existingContact = contacts.find(
        (c) => c.receiverId === businessIdFromUrl
      );

      if (existingContact) {
        // Contact exists, open the chat directly - NO NEED TO CALL createSession
        setTempBusinessData(null); // Clear temp data since we have a contact
        setSelectedContactId(existingContact.id);
        setShowChatView(true);
        setMessages([]);
        setLoading(true);

        try {
          // Use the chatId from the existing contact (which is the _id from API)
          const chatId = existingContact.chatId || existingContact.id;
          if (chatId) {
            setSelectedChatId(chatId);
          } else {
            console.error("No chatId found for existing contact");
            setLoading(false);
          }
        } catch (error) {
          console.error("Error opening chat:", error);
          setLoading(false);
        } finally {
          // Loading will be set to false when chat history loads
        }
      } else {
        // Contact doesn't exist, fetch business data and create session
        await fetchBusinessData(businessIdFromUrl);

        // Create new chat session with the business
        setLoading(true);
        setShowChatView(true);
        try {
          const thunkResult = dispatch(
            createChatSession({
              receiver_id: businessIdFromUrl,
            })
          );

          const sessionData = await thunkResult;

          if (sessionData?.id) {
            // Reload chat list to get the new contact (only once)
            hasLoadedChatListRef.current = false;
            await loadChatList();
            setSelectedChatId(sessionData.id);
            // Temp business data will be cleared when contact is added to list
          } else {
            console.error("Failed to create chat session");
            setLoading(false);
          }
        } catch (error) {
          console.error("Error creating chat session:", error);
          setLoading(false);
        }
      }
    };

    // Only run if we have contacts loaded (or empty array) and haven't processed this business_id yet
    if (
      businessIdFromUrl &&
      userId &&
      !loadingChats &&
      hasLoadedChatListRef.current
    ) {
      startChatWithBusiness();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessIdFromUrl, userId, loadingChats, contacts, fetchBusinessData]);

  // Handle contact click
  const handleContactClick = useCallback(
    async (contact: Contact) => {
      setSelectedContactId(contact.id);
      setShowChatView(true);
      setMessages([]);
      setMessageText("");
      setLoading(true);

      // Clear typing timeouts when switching chats
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }

      // Clear unread count for this contact when opening the chat
      setContacts((prev) =>
        prev.map((c) => (c.id === contact.id ? { ...c, unreadCount: 0 } : c))
      );

      try {
        // Check if chat session exists, if not create one
        let chatId = contact.chatId;

        if (!chatId) {
          // Create new chat session
          const thunkResult = dispatch(
            createChatSession({
              receiver_id: contact.receiverId,
            })
          );

          // The thunk returns a promise, await it
          const sessionData = await thunkResult;

          if (sessionData?.id) {
            chatId = sessionData.id;
            // Update contact with new chatId
            setContacts((prev) =>
              prev.map((c) => (c.id === contact.id ? { ...c, chatId } : c))
            );
          } else {
            console.error("Failed to create chat session");
            setLoading(false);
            return;
          }
        }

        setSelectedChatId(chatId);
      } catch (error) {
        console.error("Error handling contact click:", error);
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  // Request chat history when chatId changes
  useEffect(() => {
    if (selectedChatId && isConnected) {
      // Reset history loaded flag when chatId changes
      hasLoadedChatHistoryRef.current = null;
      setIsOtherUserTyping(false);
      setMessageText("");
      setLoading(true);
      // Reset search when switching chats
      setIsSearchMode(false);
      setSearchQuery("");

      // Clear typing timeouts when switching chats
      if (otherUserTypingTimeoutRef.current) {
        clearTimeout(otherUserTypingTimeoutRef.current);
        otherUserTypingTimeoutRef.current = null;
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }
      if (contactSearchTimeoutRef.current) {
        clearTimeout(contactSearchTimeoutRef.current);
        contactSearchTimeoutRef.current = null;
      }

      // Small delay to ensure socket is ready
      setTimeout(() => {
        requestChatHistory();
      }, 500);
    } else if (!selectedChatId) {
      // Reset when no chat selected
      hasLoadedChatHistoryRef.current = null;
      setMessages([]);
      setAllMessages([]);
      setMessageText("");
      setIsOtherUserTyping(false);
      setLoading(false);
      setIsSearchMode(false);
      setSearchQuery("");

      // Clear typing timeouts
      if (otherUserTypingTimeoutRef.current) {
        clearTimeout(otherUserTypingTimeoutRef.current);
        otherUserTypingTimeoutRef.current = null;
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }
      if (contactSearchTimeoutRef.current) {
        clearTimeout(contactSearchTimeoutRef.current);
        contactSearchTimeoutRef.current = null;
      }
    }
  }, [selectedChatId, isConnected, requestChatHistory]);

  // Scroll to bottom when messages change (smooth scroll for new messages)
  // Skip during initial load - handleChatHistory handles that
  useEffect(() => {
    if (messages.length > 0 && !loading) {
      scrollToBottom(false);
    }
  }, [messages, isOtherUserTyping, scrollToBottom, loading]);

  // Scroll to bottom instantly when chat view opens or chat changes
  useEffect(() => {
    if (showChatView && selectedChatId && messages.length > 0 && !loading) {
      // Small delay to ensure DOM is fully rendered
      const timer = setTimeout(() => {
        scrollToBottom(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [showChatView, selectedChatId, loading, messages.length, scrollToBottom]);

  // Inject typing animation styles
  useEffect(() => {
    const styleId = "typing-dots-animation";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        @keyframes typing-bounce {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.7;
          }
          30% {
            transform: translateY(-8px);
            opacity: 1;
          }
        }
        .typing-dot-animation {
          animation: typing-bounce 1.4s infinite ease-in-out;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      // Cleanup: remove style on unmount (optional, can keep it)
      // const styleElement = document.getElementById(styleId);
      // if (styleElement) {
      //   document.head.removeChild(styleElement);
      // }
    };
  }, []);

  // Handle back to contacts
  const handleBackToContacts = () => {
    setShowChatView(false);
    setSelectedContactId(null);
    setSelectedChatId(null);
    setMessages([]);
    setAllMessages([]);
    setMessageText("");
    setTempBusinessData(null);
    setIsOtherUserTyping(false);
    hasLoadedChatHistoryRef.current = null;
    setLoading(false);
    setIsSearchMode(false);
    setSearchQuery("");

    // Clear typing timeouts
    if (otherUserTypingTimeoutRef.current) {
      clearTimeout(otherUserTypingTimeoutRef.current);
      otherUserTypingTimeoutRef.current = null;
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
  };

  // Format date for grouping (similar to chatFormate logic)
  const chatFormate = (dateString?: string): string => {
    if (!dateString) {
      return "Today"; // Default to Today if no date
    }

    try {
      // Parse the ISO date string - parseISO converts UTC to local time
      const inputDate = parseISO(dateString);
      const now = new Date();

      // Get local date components (year, month, day) for accurate day comparison
      // This ensures we compare calendar days, not timestamps
      const inputYear = inputDate.getFullYear();
      const inputMonth = inputDate.getMonth();
      const inputDay = inputDate.getDate();

      const nowYear = now.getFullYear();
      const nowMonth = now.getMonth();
      const nowDay = now.getDate();

      // Calculate yesterday's date
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayYear = yesterday.getFullYear();
      const yesterdayMonth = yesterday.getMonth();
      const yesterdayDay = yesterday.getDate();

      // Check if it's today (same calendar day in local timezone)
      if (
        inputYear === nowYear &&
        inputMonth === nowMonth &&
        inputDay === nowDay
      ) {
        return "Today";
      }

      // Check if it's yesterday (previous calendar day in local timezone)
      if (
        inputYear === yesterdayYear &&
        inputMonth === yesterdayMonth &&
        inputDay === yesterdayDay
      ) {
        return "Yesterday";
      }

      // For older messages, use "DD MMM" format (e.g., "08 Jan")
      return format(inputDate, "dd MMM");
    } catch (error) {
      console.error("Error parsing date:", error, dateString);
      return "Today"; // Default to Today on error
    }
  };

  // Group messages by date
  const groupedMessages = () => {
    const groups: { date: string; messages: Message[]; id: string }[] = [];
    let currentDate = "";
    let currentGroup: Message[] = [];

    messages.forEach((message) => {
      // Use createdAt ISO string for date grouping, not the formatted timestamp
      const messageDate = chatFormate(message.createdAt);

      if (messageDate === currentDate) {
        currentGroup.push(message);
      } else {
        if (currentGroup.length > 0) {
          groups.push({
            date: currentDate,
            messages: currentGroup,
            id: `${currentDate}-${currentGroup[0]?.id || Date.now()}`,
          });
        }
        currentDate = messageDate;
        currentGroup = [message];
      }
    });

    if (currentGroup.length > 0) {
      groups.push({
        date: currentDate,
        messages: currentGroup,
        id: `${currentDate}-${currentGroup[0]?.id || Date.now()}`,
      });
    }

    return groups;
  };

  // Handle send message
  const handleSendMessage = useCallback(async () => {
    if (
      !messageText.trim() ||
      !selectedChatId ||
      sendingMessage ||
      !isConnected
    ) {
      return;
    }

    const messageToSend = messageText.trim();
    setMessageText("");
    setSendingMessage(true);

    try {
      // Optimistically add message to UI immediately (so sender sees it right away)
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        text: messageToSend,
        isOutgoing: true,
        timestamp: "Now",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimisticMessage]);
      setAllMessages((prev) => [...prev, optimisticMessage]);
      scrollToBottom();

      // Send message via WebSocket
      const success = sendSocketMessage(messageToSend, "normal", "");

      if (!success) {
        console.error("Failed to send message");
        // Remove optimistic message if send failed
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== optimisticMessage.id)
        );
        setMessageText(messageToSend); // Restore message if failed
      } else {
        // Update contact list: move contact to top and update lastMessage (like WhatsApp)
        setContacts((prev) => {
          const contactIndex = prev.findIndex(
            (contact) => contact.chatId === selectedChatId
          );

          if (contactIndex === -1) {
            // Contact not found, return as is
            return prev;
          }

          // Get the contact
          const contact = prev[contactIndex];

          // Update contact with new message
          const updatedContact: Contact = {
            ...contact,
            lastMessage: messageToSend,
            unreadCount: 0, // Clear unread count when sending a message
          };

          // Remove contact from current position and add to top
          const newContacts = [...prev];
          newContacts.splice(contactIndex, 1);
          return [updatedContact, ...newContacts];
        });

        // Request chat history after a short delay to sync with server
        setTimeout(() => {
          if (isConnected && selectedChatId) {
            requestChatHistory();
          }
        }, 500);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((msg) => msg.id.startsWith("temp-")));
      setMessageText(messageToSend); // Restore message if failed
    } finally {
      setSendingMessage(false);
    }
  }, [
    messageText,
    selectedChatId,
    sendSocketMessage,
    sendingMessage,
    isConnected,
    requestChatHistory,
    scrollToBottom,
  ]);

  // Handle typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Send typing indicator
    if (e.target.value.trim() && selectedChatId) {
      sendTyping();
    }

    // Send stopped typing after 2 seconds of no typing
    typingTimeoutRef.current = setTimeout(() => {
      if (selectedChatId) {
        sendStoppedTyping();
      }
    }, 2000);
  };

  // Handle Enter key
  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Highlight search terms in text
  const highlightSearchText = useCallback(
    (text: string, searchQuery: string) => {
      if (!searchQuery.trim()) {
        return <>{text}</>;
      }

      const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(${escapedQuery})`, "gi");
      const parts = text.split(regex);
      const searchLower = searchQuery.toLowerCase();

      return (
        <>
          {parts.map((part, idx) => {
            // Check if this part matches the search (case-insensitive)
            if (part.toLowerCase() === searchLower) {
              return (
                <mark
                  key={`highlight-${part}-${idx}-${text.length}`}
                  className="bg-yellow-300 dark:bg-yellow-600 px-0 py-0 rounded-[2px]"
                >
                  {part}
                </mark>
              );
            }
            return (
              <span key={`text-${part}-${idx}-${text.length}`}>{part}</span>
            );
          })}
        </>
      );
    },
    []
  );

  // Check if message matches search query
  const messageMatchesSearch = (
    message: Message,
    searchQuery: string
  ): boolean => {
    if (!searchQuery.trim()) {
      return false;
    }
    return message.text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  // Handle contact search input change with debounce
  const handleContactSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = e.target.value;
    setContactSearchQuery(query);

    // Clear existing timeout
    if (contactSearchTimeoutRef.current) {
      clearTimeout(contactSearchTimeoutRef.current);
    }

    // Debounce the API call
    contactSearchTimeoutRef.current = setTimeout(() => {
      hasLoadedChatListRef.current = false; // Allow reload when searching
      loadChatList(query);
    }, 300);
  };

  // Handle search input change with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // For local highlighting, we don't need to call API
    // Just update the search query and messages will be highlighted
    // If user wants to search server-side, we can add that later
    searchTimeoutRef.current = setTimeout(() => {
      if (!query.trim()) {
        // If search is cleared, show all messages
        setMessages(allMessages);
      } else {
        // Keep all messages but they will be highlighted in render
        setMessages(allMessages);

        // Scroll to first matching message
        const firstMatch = allMessages.find((msg) =>
          messageMatchesSearch(msg, query)
        );
        if (firstMatch) {
          // Scroll to first match after a short delay
          setTimeout(() => {
            const element = document.getElementById(`message-${firstMatch.id}`);
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }, 100);
        }
      }
    }, 300);
  };

  // Handle search mode toggle
  const handleToggleSearch = () => {
    if (isSearchMode) {
      // Exit search mode
      setIsSearchMode(false);
      setSearchQuery("");
      // Restore all messages without highlighting
      setMessages(allMessages);
    } else {
      // Enter search mode
      setIsSearchMode(true);
    }
  };

  // Focus search input when search mode is enabled
  useEffect(() => {
    if (isSearchMode && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchMode]);

  // Focus contact search input when it becomes visible
  useEffect(() => {
    if (isContactSearchVisible) {
      // Small delay to ensure the input is rendered
      setTimeout(() => {
        const input = document.querySelector(
          'input[name="contact-search"]'
        ) as HTMLInputElement;
        if (input) {
          input.focus();
        }
      }, 100);
    }
  }, [isContactSearchVisible]);

  const selectedContact = contacts.find((c) => c.id === selectedContactId);

  return (
    <div className="flex flex-col lg:flex-row h-full gap-[8px] sm:gap-[12px] lg:gap-[16px]">
      {/* Left Panel - Contacts List */}
      <div
        className={`w-full lg:w-[326px] flex flex-col bg-white md:rounded-[16px] ${
          showChatView ? "hidden lg:flex lg:h-auto" : "flex h-full lg:h-auto"
        }`}
      >
        {/* Contacts Header */}
        <div
          className={`border-solid border-t md:border-t-0 border-0 border-b border-graySoft border-opacity-50 px-[10px] xxs:px-[20px] xs:px-[40px] md:px-[20px] ${
            isContactSearchVisible
              ? "py-[2px] sm:py-[7px] md:py-[11px]"
              : "py-[12px] sm:py-[16px] md:py-[20px]"
          }`}
        >
          {!isContactSearchVisible ? (
            <div className="flex items-center justify-between">
              <h2 className="text-textSm font-light text-opacity-50 text-obsidianBlack xl:leading-[100%] xl:tracking-[0.3px]">
                Contacts
              </h2>
              <BaseButton
                onClick={() => setIsContactSearchVisible(true)}
                className="border-none bg-transparent"
                startIcon={
                  <SearchIcon className="text-obsidianBlack w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]" />
                }
              />
            </div>
          ) : (
            <div className="flex items-center gap-[8px] sm:gap-[12px] w-full">
              <BaseButton
                onClick={() => {
                  setIsContactSearchVisible(false);
                  setContactSearchQuery("");
                  hasLoadedChatListRef.current = false;
                  loadChatList("");
                }}
                className="border-none bg-transparent p-1 flex-shrink-0"
                startIcon={
                  <BackArrowIcon size={20} className="text-obsidianBlack" />
                }
              />
              <div className="flex-1 relative">
                <BaseInput
                  name="contact-search"
                  type="text"
                  placeholder="Search contacts..."
                  value={contactSearchQuery}
                  onChange={handleContactSearchChange}
                  className="w-full px-3 sm:px-4 py-2 border border-graySoft border-opacity-50 rounded-[8px] text-textBase text-obsidianBlack placeholder-stoneGray ring-0"
                />
                {contactSearchQuery && (
                  <BaseButton
                    onClick={() => {
                      setContactSearchQuery("");
                      hasLoadedChatListRef.current = false;
                      loadChatList("");
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 border-none bg-transparent p-1"
                    startIcon={
                      <CloseIcon className="text-obsidianBlack w-[14px] h-[14px]" />
                    }
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {loadingChats ? (
            <div className="flex justify-center items-center py-8">
              <BaseLoader />
            </div>
          ) : contacts.length === 0 ? (
            <div className="flex justify-center items-center py-8">
              <p className="text-textSm text-obsidianBlack text-opacity-50">
                No chats yet
              </p>
            </div>
          ) : (
            contacts.map((contact) => (
              <BaseButton
                key={contact.id}
                onClick={() => handleContactClick(contact)}
                className={`w-full gap-[5px] sm:gap-[7px] px-[10px] xxs:px-[20px] xs:px-[40px] md:px-[20px] py-[12px] sm:py-[14px] lg:py-[16px] rounded-none border-solid border-0 border-b border-graySoft border-opacity-50 flex items-center hover:bg-graySoft hover:bg-opacity-30 transition-colors justify-start ${
                  selectedContactId === contact.id
                    ? "bg-graySoft bg-opacity-30"
                    : "bg-transparent"
                }`}
              >
                <div className="relative w-[40px] h-[40px] sm:w-[44px] sm:h-[44px] lg:w-[48px] lg:h-[48px] border-[2px] border-solid border-obsidianBlack border-opacity-20 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={contact?.avatar}
                    alt={contact.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-textBase font-light text-obsidianBlack mb-[2px] sm:mb-[3px] truncate xl:leading-[100%] xl:tracking-[0px]">
                      {contact.name}
                    </h3>
                    {contact.unreadCount && contact.unreadCount > 0 ? (
                      <div className="bg-deepTeal text-white text-[10px] sm:text-[11px] font-bold rounded-full min-w-[18px] sm:min-w-[20px] h-[18px] sm:h-[20px] px-[6px] sm:px-[7px] flex items-center justify-center flex-shrink-0">
                        {contact.unreadCount > 9 ? "9+" : contact.unreadCount}
                      </div>
                    ) : null}
                  </div>
                  <p className="text-textSm font-light text-obsidianBlack text-opacity-50 truncate xl:leading-[100%] xl:tracking-[0.3px]">
                    {contact.lastMessage}
                  </p>
                </div>
              </BaseButton>
            ))
          )}
        </div>
      </div>

      {/* Right Panel - Chat Window */}
      <div
        className={`flex-1 flex flex-col bg-white md:rounded-[16px] min-h-0 ${
          showChatView ? "flex" : "hidden lg:flex"
        }`}
      >
        {!selectedContact && !tempBusinessData ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-textBase text-obsidianBlack text-opacity-50">
              Select a contact to start chatting
            </p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div
              className={`flex items-center justify-between border-solid border-t md:border-t-0 border-0 border-b border-graySoft border-opacity-50 px-[10px] xxs:px-[20px] xs:px-[40px] md:px-[32px] xl:px-[42px] ${
                isSearchMode
                  ? "py-[7px] sm:py-[10.5px] md:py-[10.5px]"
                  : "py-[10px] sm:py-[12px]"
              }`}
            >
              {!isSearchMode ? (
                <>
                  <div className="flex items-center gap-[5px] sm:gap-[7px]">
                    {/* Back Button - Only visible on mobile */}
                    <BaseButton
                      onClick={handleBackToContacts}
                      className="lg:hidden border-none bg-transparent mr-[8px] p-1"
                      startIcon={
                        <BackArrowIcon
                          size={20}
                          className="text-obsidianBlack"
                        />
                      }
                    />
                    <div className="relative w-[32px] h-[32px] sm:w-[36px] sm:h-[36px] border-[2px] border-solid border-obsidianBlack border-opacity-20 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={
                          selectedContact?.avatar ||
                          tempBusinessData?.business_image ||
                          user_image.src
                        }
                        alt={
                          selectedContact?.name ||
                          tempBusinessData?.business_name ||
                          "Business"
                        }
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="text-textSm font-light text-obsidianBlack xl:leading-[100%] xl:tracking-[0px]">
                      {selectedContact?.name ||
                        tempBusinessData?.business_name ||
                        "Business"}
                    </h3>
                  </div>
                  <div className="flex items-center">
                    <BaseButton
                      onClick={handleToggleSearch}
                      className="border-none bg-transparent"
                      startIcon={
                        <SearchIcon className="text-obsidianBlack w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]" />
                      }
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-[8px] sm:gap-[12px] w-full">
                  <BaseButton
                    onClick={handleToggleSearch}
                    className="border-none bg-transparent p-1 flex-shrink-0"
                    startIcon={
                      <BackArrowIcon size={20} className="text-obsidianBlack" />
                    }
                  />
                  <div className="flex-1 relative">
                    <BaseInput
                      type="text"
                      placeholder="Search messages..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="w-full px-3 sm:px-4 py-2 border border-graySoft border-opacity-50 rounded-[8px] text-textBase text-obsidianBlack placeholder-stoneGray ring-0"
                    />
                    {searchQuery && (
                      <BaseButton
                        onClick={() => {
                          setSearchQuery("");
                          setMessages(allMessages);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 border-none bg-transparent p-1"
                        startIcon={
                          <CloseIcon className="text-obsidianBlack w-[14px] h-[14px]" />
                        }
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Messages Area */}
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto relative"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(https://i.pinimg.com/600x315/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg)",
                backgroundRepeat: "repeat",
                backgroundSize: "auto",
                backgroundPosition: "center",
                backgroundAttachment: "local",
              }}
            >
              <div className="relative z-10 px-[10px] xxs:px-[20px] xs:px-[40px] md:px-[32px] xl:px-[42px] py-[16px] sm:py-[24px] lg:py-[30px]">
                {loading ||
                (selectedChatId && !isConnected) ||
                (selectedChatId &&
                  hasLoadedChatHistoryRef.current !== selectedChatId) ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="flex gap-[4px] items-center">
                      <span
                        className="w-[8px] h-[8px] bg-obsidianBlack bg-opacity-60 rounded-full typing-dot-animation"
                        style={{ animationDelay: "0ms" }}
                      ></span>
                      <span
                        className="w-[8px] h-[8px] bg-obsidianBlack bg-opacity-60 rounded-full typing-dot-animation"
                        style={{ animationDelay: "200ms" }}
                      ></span>
                      <span
                        className="w-[8px] h-[8px] bg-obsidianBlack bg-opacity-60 rounded-full typing-dot-animation"
                        style={{ animationDelay: "400ms" }}
                      ></span>
                    </div>
                  </div>
                ) : (
                  <div>
                    {groupedMessages().length === 0 ? (
                      <div className="flex justify-center items-center h-full">
                        <p className="text-textBase text-obsidianBlack text-opacity-50">
                          No messages yet. Start the conversation!
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-[12px] sm:gap-[16px] lg:gap-[20px]">
                        {groupedMessages().map((group, groupIndex) => {
                          const isFirstGroup = groupIndex === 0;
                          return (
                            <div
                              key={group.id}
                              className={
                                !isFirstGroup ? "mt-[24px] sm:mt-[30px]" : ""
                              }
                            >
                              {group.date && group.date !== "Today" && (
                                <div className="flex justify-center my-[20px] sm:my-[24px] lg:my-[30px]">
                                  <span className="text-textSm px-[16px] sm:px-[20px] lg:px-[26px] py-[6px] sm:py-[7px] text-obsidianBlack font-light text-opacity-70 bg-graySoft bg-opacity-25 rounded-[12px] sm:rounded-[16px] xl:leading-[100%] xl:tracking-[0.3px]">
                                    {group.date}
                                  </span>
                                </div>
                              )}
                              {group.date === "Today" && !isFirstGroup && (
                                <div className="flex justify-center my-[20px] sm:my-[24px] lg:my-[30px]">
                                  <span className="text-textSm px-[16px] sm:px-[20px] lg:px-[26px] py-[6px] sm:py-[7px] text-obsidianBlack font-light text-opacity-70 bg-graySoft bg-opacity-25 rounded-[12px] sm:rounded-[16px] xl:leading-[100%] xl:tracking-[0.3px]">
                                    Today
                                  </span>
                                </div>
                              )}
                              <div className="flex flex-col gap-[12px] sm:gap-[16px] lg:gap-[20px]">
                                {group.messages.map((message) => {
                                  const isMatch =
                                    searchQuery.trim() &&
                                    messageMatchesSearch(message, searchQuery);
                                  return (
                                    <div
                                      key={message.id}
                                      id={`message-${message.id}`}
                                      className={`flex ${
                                        message.isOutgoing
                                          ? "justify-end"
                                          : "justify-start"
                                      }`}
                                    >
                                      <div
                                        className={`max-w-[85%] sm:max-w-[75%] lg:max-w-[70%] py-[10px] sm:py-[12px] lg:py-[14px] px-[14px] sm:px-[16px] lg:px-[20px] ${
                                          message.isOutgoing
                                            ? "bg-deepTeal text-white rounded-t-[12px] sm:rounded-t-[16px] rounded-bl-[12px] sm:rounded-bl-[16px]"
                                            : "bg-deepTeal bg-opacity-10 text-obsidianBlack rounded-b-[12px] sm:rounded-b-[16px] rounded-tr-[12px] sm:rounded-tr-[16px]"
                                        } ${
                                          isMatch
                                            ? "ring-2 ring-yellow-400 ring-opacity-75"
                                            : ""
                                        }`}
                                      >
                                        <p className="text-textBase font-light xl:leading-[100%] xl:tracking-[0.3px] break-words">
                                          {searchQuery.trim()
                                            ? highlightSearchText(
                                                message.text,
                                                searchQuery
                                              )
                                            : message.text}
                                        </p>
                                        <p
                                          className={`mt-[3px] sm:mt-[4px] text-textSm text-opacity-50 font-light xl:leading-[100%] xl:tracking-[0.3px] ${
                                            message.isOutgoing
                                              ? "text-white text-opacity-50 text-end"
                                              : "text-obsidianBlack text-opacity-50 text-start"
                                          }`}
                                        >
                                          {message.timestamp}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}

                        {/* Typing Indicator */}
                        {isOtherUserTyping && (
                          <div className="flex justify-start mt-[12px] sm:mt-[16px]">
                            <div className="max-w-[85%] sm:max-w-[75%] lg:max-w-[70%] py-[10px] sm:py-[12px] lg:py-[14px] px-[14px] sm:px-[16px] lg:px-[20px] bg-deepTeal bg-opacity-10 rounded-b-[12px] sm:rounded-b-[16px] rounded-tr-[12px] sm:rounded-tr-[16px]">
                              <div className="flex items-center gap-[6px]">
                                <div className="flex gap-[4px] items-center">
                                  <span
                                    className="w-[8px] h-[8px] bg-obsidianBlack bg-opacity-60 rounded-full typing-dot-animation"
                                    style={{ animationDelay: "0ms" }}
                                  ></span>
                                  <span
                                    className="w-[8px] h-[8px] bg-obsidianBlack bg-opacity-60 rounded-full typing-dot-animation"
                                    style={{ animationDelay: "200ms" }}
                                  ></span>
                                  <span
                                    className="w-[8px] h-[8px] bg-obsidianBlack bg-opacity-60 rounded-full typing-dot-animation"
                                    style={{ animationDelay: "400ms" }}
                                  ></span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
            </div>

            {/* Message Input Area */}
            <div className="bg-graySoft bg-opacity-10 px-[10px] xxs:px-[20px] xs:px-[40px] md:px-[32px] xl:px-[42px] py-[12px] border-solid border-0 border-t border-graySoft border-opacity-50">
              <div className="flex items-center justify-between gap-[6px] sm:gap-[8px] lg:gap-[10px]">
                <div className="flex items-center gap-[8px] sm:gap-[16px] lg:gap-[23px] flex-1 min-w-0">
                  <BaseButton
                    className="p-1.5 sm:p-2 border-none bg-transparent flex-shrink-0"
                    startIcon={
                      <MicrophoneIcon className="text-obsidianBlack w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]" />
                    }
                  />
                  <BaseInput
                    type="text"
                    placeholder="Write message"
                    value={messageText}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    disabled={!isConnected || sendingMessage}
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-graySoft border-opacity-50 rounded-[8px] text-textBase text-obsidianBlack placeholder-stoneGray ring-0 min-w-0"
                    fullWidth
                  />
                </div>

                <div className="flex items-center gap-[8px] sm:gap-[16px] lg:gap-[24px] flex-shrink-0">
                  <div className="flex items-center gap-[8px] sm:gap-[16px] lg:gap-[24px]">
                    <BaseButton
                      className="border-none bg-transparent p-1 sm:p-0"
                      startIcon={
                        <AttachmentIcon className="text-obsidianBlack w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]" />
                      }
                    />
                    <BaseButton
                      className="border-none bg-transparent p-1 sm:p-0"
                      startIcon={
                        <ImageIcon className="text-obsidianBlack w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]" />
                      }
                    />
                  </div>
                  <div>
                    <BaseButton
                      onClick={handleSendMessage}
                      disabled={
                        !messageText.trim() || !isConnected || sendingMessage
                      }
                      className="px-[10px] sm:px-[14px] lg:px-[22px] py-[8px] sm:py-[9px] lg:py-[10px] gap-[6px] sm:gap-[8px] bg-deepTeal text-white rounded-[6px] sm:rounded-[8px] flex items-center justify-center border-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="hidden lg:inline">Send</span>
                      <SendIcon className="text-white w-[14px] h-[14px] sm:w-[16px] sm:h-[16px]" />
                    </BaseButton>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
