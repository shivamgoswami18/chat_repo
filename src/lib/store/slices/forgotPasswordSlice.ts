import { ForgotPasswordStep } from "@/types/forgotPassword";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
interface ForgotPasswordState {
  step: ForgotPasswordStep;
  email: string | null;
  otp: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: ForgotPasswordState = {
  step: ForgotPasswordStep.email,
  email: null,
  otp: null,
  loading: false,
  error: null,
};

const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setOtp: (state, action) => {
      state.otp = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetForgotPasswordState: () => initialState,
  },
});

export const {
  setStep,
  setEmail,
  setOtp,
  resetForgotPasswordState,
  setError,
  setLoading,
  clearError,
} = forgotPasswordSlice.actions;

export default forgotPasswordSlice.reducer;
