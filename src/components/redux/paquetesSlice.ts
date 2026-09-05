import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { PaqueteAPI } from "../../../types/paquete";

interface PaquetesState {
  paquetes: PaqueteAPI[];
  cargando: boolean;
  error: string | null;
}

const estadoInicial: PaquetesState = {
  paquetes: [],
  cargando: false,
  error: null,
};

const paquetesSlice = createSlice({
  name: "paquetes",
  initialState: estadoInicial,
  reducers: {
    iniciarCarga: (state) => {
      state.cargando = true;
      state.error = null;
    },

    cargarPaquetes: (
      state,
      action: PayloadAction<PaqueteAPI[]>
    ) => {
      state.paquetes = action.payload;
      state.cargando = false;
      state.error = null;
    },

    establecerError: (
      state,
      action: PayloadAction<string>
    ) => {
      state.cargando = false;
      state.error = action.payload;
    },
  },
});

export const {
  iniciarCarga,
  cargarPaquetes,
  establecerError,
} = paquetesSlice.actions;

export default paquetesSlice.reducer;
