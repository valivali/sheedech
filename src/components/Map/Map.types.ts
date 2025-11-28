import type { StyleSpecification } from "maplibre-gl";
import type { MapLayerMouseEvent } from "react-map-gl/maplibre";

export interface MapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch?: number;
  bearing?: number;
}

export interface MapBounds {
  minLon: number;
  maxLon: number;
  minLat: number;
  maxLat: number;
}

export interface MapProps {
  initialViewState: MapViewState;
  onViewStateChange?: (viewState: MapViewState) => void;
  onClick?: (event: MapLayerMouseEvent) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface MapProviderProps extends MapProps {
  mapStyle?: string | StyleSpecification;
}

