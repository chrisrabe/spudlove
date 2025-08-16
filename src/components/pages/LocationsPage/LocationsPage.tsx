import React from "react";
import LocationsMap from "./LocationsMap.tsx";
import PageLayout from "@/components/shared/PageLayout.tsx";

const LocationsPage: React.FC = () => {
  return (
    <PageLayout>
      <LocationsMap />
    </PageLayout>
  );
};

export default LocationsPage;
