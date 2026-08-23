import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
}

interface WeatherState {
  data: WeatherData | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  lastUpdated: string | null;
}

const initialState: WeatherState = {
  data: null,
  status: "idle",
  error: null,
  lastUpdated: null,
};

export const fetchWeather = createAsyncThunk(
  "weather/fetchWeather",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "https://api.open-meteo.com/v1/forecast",
        {
          params: {
            latitude: 4.711,
            longitude: -74.072,
            current:
              "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m",
          },
        }
      );

      const clima = response.data.current;

      return {
        temperature: clima.temperature_2m,
        humidity: clima.relative_humidity_2m,
        windSpeed: clima.wind_speed_10m,
        weatherCode: clima.weather_code,
      };
    } catch {
      return rejectWithValue(
        "No fue posible consultar el clima."
      );
    }
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
        state.error = null;
        state.lastUpdated = new Date().toISOString();
      })

      .addCase(fetchWeather.rejected, (state, action) => {
        state.status = "failed";

        state.error =
          (action.payload as string) ||
          "Error al consultar el clima.";
      });
  },
});

export default weatherSlice.reducer;
