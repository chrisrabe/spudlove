import React from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import LocationMarker from "./LocationMarker.tsx";
import { useAtomValue } from "jotai";
import { locationsAtom } from "@/atoms/locationAtoms.ts";

const LocationsMap: React.FC = () => {
  const locationMarkers = useAtomValue(locationsAtom);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <APIProvider apiKey={import.meta.env.VITE_MAPS_API_KEY}>
        <Map
          defaultCenter={{ lat: -27.4698, lng: 153.0251 }} // Brisbane
          defaultZoom={12}
          maxZoom={15}
          minZoom={10}
          mapId={import.meta.env.VITE_MAP_ID}
          options={{
            disableDefaultUI: true,
            disableDoubleClickZoom: true,
          }}
        >
          {locationMarkers.map((marker) => (
            <LocationMarker
              key={marker.address}
              lat={marker.lat}
              lng={marker.lng}
              address={marker.address}
              startTime={marker.start_time}
              endTime={marker.end_time}
            />
          ))}
        </Map>
      </APIProvider>
    </div>
  );
};

export default LocationsMap;
