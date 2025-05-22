import type { MapProps } from 'src/components/map';
import type { Feature, Geometry, FeatureCollection } from 'geojson';

import { Layer, Source } from 'react-map-gl/mapbox';
import { useMemo, useState, useEffect } from 'react';

import { heatmapLayer } from './map-style';
import { MapControlPanel } from './control-panel';

import { Map } from 'src/components/map';

// ----------------------------------------------------------------------

type EarthquakeFeature = Feature & {
  properties: {
    time: number;
    [key: string]: unknown;
  };
};

type EarthquakeFeatureCollection = FeatureCollection<Geometry, EarthquakeFeature['properties']>;

export function MapHeatmap({ sx, ...other }: MapProps) {
  const [allDays, useAllDays] = useState(true);

  const [selectedTime, selectTime] = useState(0);

  const [earthquakes, setEarthQuakes] = useState<EarthquakeFeatureCollection>();

  const [timeRange, setTimeRange] = useState([0, 0]);

  useEffect(() => {
    fetch('https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson')
      .then((resp) => resp.json())
      .then((json: EarthquakeFeatureCollection) => {
        const { features } = json;

        const startTime = features[features.length - 1].properties.time;

        const endTime = features[0].properties.time;

        setTimeRange([startTime, endTime]);

        setEarthQuakes(json);

        selectTime(endTime);
      })
      .catch((error) => console.error('Could not load data', error));
  }, []);

  const data = useMemo(
    () => (allDays ? earthquakes : filterFeaturesByDay(earthquakes, selectedTime)) || { type: 'FeatureCollection' as const, features: [] },
    [earthquakes, allDays, selectedTime]
  );

  return (
    <Map initialViewState={{ latitude: 40, longitude: -100, zoom: 3 }} sx={sx} {...other}>
      {data && (
        <Source type="geojson" data={data}>
          <Layer {...heatmapLayer} />
        </Source>
      )}

      <MapControlPanel
        startTime={timeRange[0]}
        endTime={timeRange[1]}
        selectedTime={selectedTime}
        allDays={allDays}
        onChangeTime={selectTime}
        onChangeAllDays={useAllDays}
      />
    </Map>
  );
}

// ----------------------------------------------------------------------

function filterFeaturesByDay(
  featureCollection: EarthquakeFeatureCollection | undefined,
  time: number
): EarthquakeFeatureCollection {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const features = featureCollection?.features.filter((feature) => {
    const featureDate = new Date(feature.properties.time);
    return (
      featureDate.getFullYear() === year &&
      featureDate.getMonth() === month &&
      featureDate.getDate() === day
    );
  });

  return { type: 'FeatureCollection', features: features || [] };
}
