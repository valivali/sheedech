"use client";

import { MapLibreProvider } from './providers';
import { MapProps } from './Map.types';
import styles from './Map.module.scss';

export const Map = ({
  initialViewState,
  onViewStateChange,
  onClick,
  children,
  className
}: MapProps) => {
  return (
    <div className={`${styles.mapContainer} ${className || ''}`}>
      <MapLibreProvider
        initialViewState={initialViewState}
        onViewStateChange={onViewStateChange}
        onClick={onClick}
      >
        {children}
      </MapLibreProvider>
    </div>
  );
};

