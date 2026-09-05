import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../api";
import type { Reservation } from "../../models";

interface ReservasState {
  reservas: Reservation[];
  cargando: boolean;
  error: string | null;
  ultimaActualizacion: string | null;
}

const initialState: ReservasState = {
  reservas: [],
  cargando: false,
  error: null,
  ultimaActualizacion: null,
};

// Trae las reservas reales desde la tabla "reservations" de la base de datos
export const obtenerReservas = createAsyncThunk(
  "reservas/obtenerReservas",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.reservations();
      return data;
    } catch {
      return rejectWithValue("No fue posible consultar las reservas.");
    }
  }
);

const reservasSlice = createSlice({
  name: "reservas",
  initialState,
  reducers: {
    // Permite reflejar de inmediato una reserva recién creada,
    // sin esperar a un nuevo fetch, para que el contador se sienta "en vivo".
    agregarReserva: (state, action: PayloadAction<Reservation>) => {
      state.reservas = [action.payload, ...state.reservas];
      state.ultimaActualizacion = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(obtenerReservas.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(obtenerReservas.fulfilled, (state, action) => {
        state.reservas = action.payload;
        state.cargando = false;
        state.ultimaActualizacion = new Date().toISOString();
      })
      .addCase(obtenerReservas.rejected, (state, action) => {
        state.cargando = false;
        state.error = (action.payload as string) || "Error al consultar reservas.";
      });
  },
});

export const { agregarReserva } = reservasSlice.actions;
export default reservasSlice.reducer;
