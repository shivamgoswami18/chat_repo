import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";
import authReducer from "./slices/authSlice";
import projectSlice from "./slices/projectSlice";
import offersSlice from "./slices/myOffersSlice";
import subscriptionSlice from "./slices/subscriptionSlice";
import forgotPasswordSlice from "./slices/forgotPasswordSlice";
import settingSlice from "./slices/settingSlice";
import userSlice from "./slices/userSlice";
import dashboardReducer from "./slices/dashboardSlice";
import reviewSlice from "./slices/reviewSlice";

const authPersistConfig = {
  key: "auth",
  storage: storageSession,
  whitelist: ["token", "role"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  project: projectSlice,
  offers: offersSlice,
  subscription : subscriptionSlice,
  forgotPassword : forgotPasswordSlice,
  user: userSlice,
  settingState: settingSlice,
  dashboard: dashboardReducer,
  reviewState : reviewSlice,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
