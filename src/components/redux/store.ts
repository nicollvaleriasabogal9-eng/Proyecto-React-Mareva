import { configureStore } from "@reduxjs/toolkit";
import paquetesReducer from "./paquetesSlice";
import weatherReducer from "./weatherSlice";

export const store = configureStore({
  reducer: {
    paquetes: paquetesReducer,
    weather: weatherReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
