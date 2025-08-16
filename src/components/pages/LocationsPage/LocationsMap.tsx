import React from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import LocationMarker from "./LocationMarker.tsx";

const LocationsMap: React.FC = () => {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <APIProvider apiKey={import.meta.env.VITE_MAPS_API_KEY}>
        <Map
          defaultCenter={{ lat: -27.4698, lng: 153.0251 }} // Brisbane
          defaultZoom={12}
          mapId={import.meta.env.VITE_MAP_ID}
          options={{
            disableDefaultUI: true,
            disableDoubleClickZoom: true,
            styles: [
              {
                featureType: "poi",
                stylers: [{ visibility: "off" }],
              },
              {
                featureType: "transit",
                stylers: [{ visibility: "off" }],
              },
            ],
          }}
        >
          <LocationMarker
            lat={-27.530368}
            lng={153.096672}
            address="London Spuds HQ - 20 Devlan St, Mansfield"
            startTime={"2025-08-11T11:00:00"}
            endTime={"2025-08-11T13:30:00"}
          />
        </Map>
      </APIProvider>
    </div>
  );
};

export default LocationsMap;
