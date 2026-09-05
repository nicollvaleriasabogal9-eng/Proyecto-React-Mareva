export type Page = "home" | "results" | "detail" | "favorites" | "booking" | "login" | "register" | "profile" | "admin";
export type TravelMode = "bus" | "car" | "plane";
export type PetSize = "Pequeña" | "Mediana" | "Grande";

export interface SearchState {
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  adults: number;
  childrenAges: number[];
  babies: number;
  pets: PetSize[];
  travelMode: TravelMode;
}

export interface TravelPackage {
  id: number;
  slug: string;
  name: string;
  destination: string;
  department: string;
  category: string;
  description: string;
  price: number;
  days: number;
  nights: number;
  stars: number;
  rating: number;
  breakfast: boolean;
  freeCancellation: boolean;
  petFriendly: boolean;
  hotel: string;
  image: string;
  gallery: string[];
  itinerary: { day: number; title: string; description: string }[];
  included: string[];
  excluded: string[];
  petFee: number;
}

export interface RouteQuote {
  name: string;
  tolls: number;
  tollCost: number;
  distance: number;
  duration: string;
  fuel: number;
}

export interface TravelNotification {
  id: number;
  title: string;
  message: string;
  time: string;
  kind: "favorite" | "booking" | "route" | "payment" | "reminder";
  read?: boolean;
}

export interface Reservation {
  id: string;
  packageName: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: string;
  travelMode: TravelMode;
  status: "Confirmada" | "Pendiente";
  total: number;
  petName?: string;
}

export interface Filters {
  maxPrice: number;
  stars: number;
  breakfast: boolean;
  freeCancellation: boolean;
  petFriendly: boolean;
}
