import type { AppDispatch } from "@/lib/store/store";
import { authData } from "./ApiService";
import {
  CREATE_CHAT_SESSION,
  CHAT_LIST,
  UNREAD_COUNT,
} from "./ApiRoutes";
import {
  checkStatusCodeSuccess,
  errorHandler,
  finalApiMessage,
} from "@/components/constants/Common";
import { toast } from "react-toastify";

export interface CreateChatSessionPayload {
  receiver_id: string;
}

export interface CreateChatSessionResponse {
  id: string;
}

export interface ChatListPayload {
  sortKey?: string;
  sortValue?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface ChatContact {
  _id: string; // This is the chat_id
  chat_id?: string; // Legacy field, use _id instead
  user_id: string; // The other user's ID
  name?: string; // The other user's name
  profile_image?: string | null; // The other user's profile image
  last_message?: string; // Last message text
  sender_id?: string; // Legacy field
  receiver_id?: string; // Legacy field
  sender?: {
    _id: string;
    full_name?: string;
    email?: string;
    profile_image?: string;
  };
  receiver?: {
    _id: string;
    full_name?: string;
    email?: string;
    profile_image?: string;
  };
  lastMessage?: {
    message?: string;
    createdAt?: string;
  };
  unreadCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatListResponse {
  items: ChatContact[];
  totalCount: number;
  itemsCount: number;
  currentPage: number;
  totalPage: number;
  pageSize: number;
}

export interface UnreadCountResponse {
  count: number;
}

export const createChatSession = (payload: CreateChatSessionPayload) => {
  return async (dispatch: AppDispatch): Promise<CreateChatSessionResponse | null> => {
    try {
      const response = await authData.post(CREATE_CHAT_SESSION, payload);
      const responseData = response?.data;
      const message = finalApiMessage(responseData);

      if (checkStatusCodeSuccess(responseData?.statusCode)) {
        return responseData?.data;
      } else {
        toast.error(message || "Failed to create chat session");
        return null;
      }
    } catch (error) {
      errorHandler(error);
      return null;
    }
  };
};

export const getChatList = (payload: ChatListPayload = {}) => {
  return async (dispatch: AppDispatch): Promise<ChatListResponse | null> => {
    try {
      const response = await authData.post(CHAT_LIST, {
        sortKey: payload.sortKey || "_id",
        sortValue: payload.sortValue || "desc",
        page: payload.page || 1,
        limit: payload.limit || 10,
        search: payload.search || "",
      });
      const responseData = response?.data;
      const message = finalApiMessage(responseData);

      if (checkStatusCodeSuccess(responseData?.statusCode)) {
        return responseData?.data;
      } else {
        toast.error(message || "Failed to fetch chat list");
        return null;
      }
    } catch (error) {
      errorHandler(error);
      return null;
    }
  };
};

export const getUnreadCount = () => {
  return async (dispatch: AppDispatch): Promise<number> => {
    try {
      const response = await authData.get(UNREAD_COUNT);
      const responseData = response?.data;

      if (checkStatusCodeSuccess(responseData?.statusCode)) {
        return responseData?.data?.count || 0;
      }
      return 0;
    } catch (error) {
      errorHandler(error);
      return 0;
    }
  };
};

