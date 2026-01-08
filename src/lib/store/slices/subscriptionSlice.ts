import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ClipHistoryResponse,
  SubscriptionResponse,
} from "@/types/subscription";

interface SubscriptionState {
  subscriptions: SubscriptionResponse | null;
  clipHistory: ClipHistoryResponse | null;
  sendPlan: string | null;
  success: string | null;
  error: string | null;
  loading: boolean;
}

const initialState: SubscriptionState = {
  subscriptions: null,
  clipHistory: null,
  sendPlan: null,
  success: null,
  error: null,
  loading: false,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setSubscriptions(state, action: PayloadAction<SubscriptionResponse>) {
      state.subscriptions = action.payload;
    },
    setHistory(state, action: PayloadAction<ClipHistoryResponse>) {
      state.clipHistory = action.payload;
    },
    setPlan(state, action: PayloadAction<string | null>) {
      state.sendPlan = action.payload;
    },
    setSuccess(state, action: PayloadAction<string | null>) {
      state.success = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.success = action.payload;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setSubscriptions,
  setHistory,
  setPlan,
  setSuccess,
  setError,
  clearError,
  clearSuccess,
  setLoading
} = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
