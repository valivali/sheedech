"use client"

import "maplibre-gl/dist/maplibre-gl.css"

import { useCallback, useState } from "react"
import Map, { ViewStateChangeEvent } from "react-map-gl/maplibre"
import type { StyleSpecification } from "maplibre-gl"

import { MapProviderProps, MapViewState } from "../Map.types"

const DEFAULT_MAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "&copy; OpenStreetMap Contributors",
      maxzoom: 19
    }
  },
  layers: [
    {
      id: "osm",
      type: "raster",
      source: "osm"
    }
  ]
}

export const MapLibreProvider = ({
  initialViewState,
  onViewStateChange,
  onClick,
  children,
  className,
  style,
  mapStyle = DEFAULT_MAP_STYLE
}: MapProviderProps) => {
  const [viewState, setViewState] = useState<MapViewState>(initialViewState)

  const handleMove = useCallback(
    (evt: ViewStateChangeEvent) => {
      const newViewState: MapViewState = {
        longitude: evt.viewState.longitude,
        latitude: evt.viewState.latitude,
        zoom: evt.viewState.zoom,
        pitch: evt.viewState.pitch,
        bearing: evt.viewState.bearing
      }
      setViewState(newViewState)
      onViewStateChange?.(newViewState)
    },
    [onViewStateChange]
  )

  return (
    <div className={className} style={{ width: "100%", height: "100%", ...style }}>
      <Map
        initialViewState={viewState}
        onMove={handleMove}
        onClick={onClick}
        mapStyle={mapStyle}
        style={{ width: "100%", height: "100%" }}
        scrollZoom={true}
      >
        {children}
      </Map>
    </div>
  )
}
