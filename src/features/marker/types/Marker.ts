export interface Marker {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  observation?: string;
  imageUrl?: string;
  date?: string;
  createdAt: string;
}

export interface SelectedLocation {
  latitude: number;
  longitude: number;
}
