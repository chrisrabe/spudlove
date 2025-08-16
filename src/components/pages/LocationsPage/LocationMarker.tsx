import { AdvancedMarker } from "@vis.gl/react-google-maps";
import React, { useState } from "react";
import logoUrl from "@/assets/london-spuds-logo.svg?url";
import { parseISO, format } from "date-fns";

interface LocationMarkerProps {
  lat: number;
  lng: number;
  address: string;
  startTime: string;
  endTime: string;
}

const getReadableDate = (startTime: string, endTime: string) => {
  const start = parseISO(startTime);
  const end = parseISO(endTime);
  const startFormatted = format(start, "MMMM d yyyy h:mmaaa").replace(
    ":00",
    "",
  );
  const endFormatted = format(end, "h:mmaaa")
    .replace(":00", "")
    .replace(":", ".");
  return `${startFormatted} - ${endFormatted}`;
};

const LocationMarker: React.FC<LocationMarkerProps> = ({
  lat,
  lng,
  address,
  startTime,
  endTime,
}) => {
  const [showBubble, setShowBubble] = useState(false);
  const date = getReadableDate(startTime, endTime);

  const openDirections = () => {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    window.open(url, "_blank");
  };

  return (
    <AdvancedMarker position={{ lat, lng }}>
      <div style={{ position: "relative", cursor: "pointer" }}>
        {/* Circle marker */}
        <div
          onClick={() => setShowBubble((prev) => !prev)}
          className="bg-cover bg-center w-12 h-12 rounded-full border border-white shadow-2xl"
          style={{
            backgroundImage: `url(${logoUrl})`,
          }}
        />

        {/* Speech bubble */}
        {showBubble && (
          <div className="absolute bottom-12 left-1/2 py-3 px-2 bg-white rounded -translate-x-1/2 shadow-lg text-nowrap">
            <div className="flex gap-2 p-2">
              <div className="flex flex-col justify-center">
                <img
                  src={logoUrl}
                  alt="london spuds logo"
                  className="w-20 h-20"
                />
                <a
                  className="text-center underline text-blue-800"
                  href="https://www.londonspuds.com.au/"
                  target="_blank"
                >
                  View website
                </a>
              </div>
              <div className="p-3 space-y-2">
                <div>
                  <p className="text-lg font-bold">{address}</p>
                  <p className="text-sm">{date}</p>
                </div>
                <div className="inline-flex gap-2 justify-end w-full">
                  <button className="p-2 bg-black text-white text-sm rounded-lg cursor-pointer">
                    Notify Me
                  </button>
                  <button
                    className="p-2 border border-black text-sm rounded-lg cursor-pointer"
                    onClick={openDirections}
                  >
                    Get Directions
                  </button>
                </div>
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "-8px",
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderTop: "8px solid white",
              }}
            />
          </div>
        )}
      </div>
    </AdvancedMarker>
  );
};

export default LocationMarker;
