import type { Reservation, TravelPackage } from "./models";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
  });
  if (!response.ok) throw new Error(`API ${response.status}`);
  return response.json() as Promise<T>;
}

export const api = {
  health: () => request<{ status: string; database: string }>("/health"),
  packages: () => request<TravelPackage[]>("/packages"),
  createReservation: (reservation: Reservation) => request<Reservation>("/reservations", { method: "POST", body: JSON.stringify(reservation) }),
  reservations: () => request<Reservation[]>("/reservations"),
  toggleFavorite: (packageId: number, active: boolean) => request<{ ok: boolean }>(`/favorites/${packageId}`, { method: active ? "POST" : "DELETE" }),
};
