import { UserNotifications } from "@/types/user";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type SettingErrorSource = "changePassword" | "notifications";

export interface SettingErrorState {
  changePassword: string | null;
  notifications: string | null;
}

export interface SettingState {
  loading: boolean;
  error: SettingErrorState;
  success: string | null;
  notifications: UserNotifications | null;
}


const initialState: SettingState = {
  loading: false,
  error: {
    changePassword: null,
    notifications: null,
  },
  success: null,
  notifications: null,
};

const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (
      state,
      action: PayloadAction<{ source: SettingErrorSource; message: string | null }>
    ) => {
      state.error[action.payload.source] = action.payload.message;
    },
    clearError: (state, action: PayloadAction<SettingErrorSource | "all">) => {
      if (action.payload === "all") {
        state.error.changePassword = null;
        state.error.notifications = null;
      } else {
        state.error[action.payload] = null;
      }
    },
    setSuccess(state, action: PayloadAction<string | null>) {
      state.success = action.payload;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    setNotifications(state, action: PayloadAction<UserNotifications | null>) {
      state.notifications = action.payload;
    }
  },
});

export const { setLoading, setError, clearError , setSuccess , clearSuccess, setNotifications } = settingSlice.actions;
export default settingSlice.reducer;
