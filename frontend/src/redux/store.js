import { configureStore, combineReducers } from "@reduxjs/toolkit";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import storage from "redux-persist/lib/storage";

import authReducer from "./authSlice";
import jobReducer from "./jobSlice";
import companyReducer from "./companySlice";
import applicationReducer from "./applicationSlice";

// ==========================
// Root Reducer
// ==========================

const rootReducer = combineReducers({
  auth: authReducer,
  job: jobReducer,
  company: companyReducer,
  application: applicationReducer,
});

// ==========================
// Persist Configuration
// ==========================

const persistConfig = {
  key: "root",
  version: 1,
  storage,

  // Persist only these slices
  whitelist: ["auth"],
};

// ==========================
// Persisted Reducer
// ==========================

const persistedReducer = persistReducer(
  persistConfig,
  rootReducer
);

// ==========================
// Store
// ==========================

const store = configureStore({
  reducer: persistedReducer,

  devTools: import.meta.env.DEV,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }),
});

// ==========================
// Persistor
// ==========================

export const persistor = persistStore(store);

export default store;