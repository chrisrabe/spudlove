import React from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

const CustomMap: React.FC = () => {
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <APIProvider apiKey={import.meta.env.VITE_MAPS_API_KEY}>
        <Map
          defaultCenter={{ lat: -27.4698, lng: 153.0251 }} // Brisbane
          defaultZoom={12}
          mapId={import.meta.env.VITE_MAP_ID}
          options={{
            disableDefaultUI: true,
          }}
        >
          <AdvancedMarker position={{ lat: -27.4698, lng: 153.0251 }}>
            <div
              style={{
                background: "red",
                width: 20,
                height: 20,
                borderRadius: "50%",
                border: "2px solid white",
              }}
            />
          </AdvancedMarker>
        </Map>
      </APIProvider>
    </div>
  );
};

export default CustomMap;
