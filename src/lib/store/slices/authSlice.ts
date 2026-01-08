import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  setItem,
  removeItem,
  commonLabels,
  getItem,
} from "@/components/constants/Common";
import type { RootState } from "../store";

export interface AuthState {
  loading: boolean;
  token: string | null;
  role: string | null;
  error: string | null;
  id: string | null;
}

const getInitialToken = (): string | null => {
  return getItem(commonLabels.token);
};

const getInitialRole = (): string | null => {
  return getItem(commonLabels.role);
};

const getInitialId = (): string | null => {
  return getItem(commonLabels.id);
};

const initialState: AuthState = {
  loading: false,
  token: getInitialToken(),
  role: getInitialRole(),
  error: null,
  id: getInitialId(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      const token = action.payload;
      state.token = token;
      setItem(commonLabels.token, token);
    },
    setId: (state, action: PayloadAction<string>) => {
      const id = String(action.payload);
      state.id = id;
      setItem(commonLabels.id, id);
    },
    clearToken: (state) => {
      state.token = null;
      removeItem(commonLabels.token);
    },
    setRole: (state, action: PayloadAction<string>) => {
      const role = action.payload;
      state.role = role;
      setItem(commonLabels.role, role);
    },
    clearRole: (state) => {
      state.role = null;
      removeItem(commonLabels.role);
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setToken,
  clearToken,
  setRole,
  clearRole,
  setError,
  clearError,
  setId,
} = authSlice.actions;

export const selectIsBusiness = (state: RootState): boolean => {
  return state.auth.role === commonLabels.businessRole;
};

export const selectIsAuthenticated = (state: RootState): boolean => {
  return !!state.auth.token;
};

export default authSlice.reducer;
