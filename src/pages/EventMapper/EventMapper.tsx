"use client";

import { useState, useCallback, useEffect } from "react";
import { Popup } from "react-map-gl/maplibre";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Map, EventMarker, MapEventCard } from "@/components/Map";
import { MapViewState, MapBounds } from "@/components/Map/Map.types";
import { useEventsByBounds } from "@/api/frontend/events";
import { EventCardData } from "@/types/event";
import { getObfuscatedLocation } from "@/components/Map/utils";
import styles from "./EventMapper.module.scss";

const CALGARY_VIEW = {
  longitude: -114.0719,
  latitude: 51.0447,
  zoom: 11,
};

function calculateBounds(viewState: MapViewState): MapBounds {
  const latOffset = 0.5 / Math.pow(2, viewState.zoom - 10);
  const lonOffset = 0.7 / Math.pow(2, viewState.zoom - 10);

  return {
    minLat: viewState.latitude - latOffset,
    maxLat: viewState.latitude + latOffset,
    minLon: viewState.longitude - lonOffset,
    maxLon: viewState.longitude + lonOffset,
  };
}

export default function EventMapper() {
  const [bounds, setBounds] = useState<MapBounds | null>(() =>
    calculateBounds(CALGARY_VIEW)
  );
  const [debouncedBounds, setDebouncedBounds] = useState<MapBounds | null>(
    bounds
  );
  const [selectedEvent, setSelectedEvent] = useState<EventCardData | null>(null);

  const { data: events = [], isLoading } = useEventsByBounds(debouncedBounds);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedBounds(bounds);
    }, 400);

    return () => clearTimeout(timer);
  }, [bounds]);

  const handleViewStateChange = useCallback((viewState: MapViewState) => {
    const newBounds = calculateBounds(viewState);
    setBounds(newBounds);
  }, []);

  const handleMarkerClick = useCallback((event: EventCardData) => {
    setSelectedEvent(event);
  }, []);

  const handleClosePopup = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  const handleMapClick = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.mapWrapper}>
          <Map
            initialViewState={CALGARY_VIEW}
            onViewStateChange={handleViewStateChange}
            onClick={handleMapClick}
          >
            {events.map((event) => (
              <EventMarker 
                key={event.id} 
                event={event}
                onClick={handleMarkerClick}
              />
            ))}
            
            {selectedEvent && selectedEvent.lat && selectedEvent.lon && (
              <Popup
                longitude={getObfuscatedLocation(selectedEvent.lat, selectedEvent.lon, selectedEvent.id).lon}
                latitude={getObfuscatedLocation(selectedEvent.lat, selectedEvent.lon, selectedEvent.id).lat}
                onClose={handleClosePopup}
                closeButton={false}
                closeOnClick={false}
                anchor="bottom"
                offset={40}
                style={{ maxWidth: "320px" }}
              >
                <MapEventCard 
                  event={selectedEvent}
                  onClose={handleClosePopup}
                />
              </Popup>
            )}
          </Map>
        </div>
      </main>
      <Footer />
    </div>
  );
}

