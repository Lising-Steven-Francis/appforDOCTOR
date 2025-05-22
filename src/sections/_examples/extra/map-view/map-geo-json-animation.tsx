import type { Point } from 'geojson';
import type { Theme } from '@mui/material/styles';
import type { MapProps } from 'src/components/map';
import type { LayerProps } from 'react-map-gl/mapbox';

import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Layer, Source } from 'react-map-gl/mapbox';

import { Map, MapControls } from 'src/components/map';

// ----------------------------------------------------------------------

type PointData = Point;

export function MapGeoJSONAnimation({ sx, ...other }: MapProps) {
  const theme = useTheme();

  const [pointData, setPointData] = useState<PointData | null>(null);

  useEffect(() => {
    const animation = window.requestAnimationFrame(() =>
      setPointData(pointOnCircle({ center: [-100, 0], angle: Date.now() / 1000, radius: 20 }))
    );

    return () => window.cancelAnimationFrame(animation);
  });

  return (
    <Map
      initialViewState={{ latitude: 0, longitude: -100, zoom: 3 }}
      mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
      sx={sx}
      {...other}
    >
      <MapControls />

      {pointData && (
        <Source type="geojson" data={pointData}>
          <Layer {...pointLayer(theme)} />
        </Source>
      )}
    </Map>
  );
}

// ----------------------------------------------------------------------

const pointLayer = (theme: Theme): LayerProps => ({
  id: 'point',
  type: 'circle',
  paint: {
    'circle-radius': 10,
    'circle-color': theme.palette.error.main,
  },
});

function pointOnCircle({
  center,
  angle,
  radius,
}: {
  center: [number, number];
  angle: number;
  radius: number;
}): PointData {
  return {
    type: 'Point',
    coordinates: [center[0] + Math.cos(angle) * radius, center[1] + Math.sin(angle) * radius] as [number, number],
  };
}
