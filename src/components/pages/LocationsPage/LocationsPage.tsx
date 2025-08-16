import React, { useEffect } from "react";
import LocationsMap from "./LocationsMap.tsx";
import PageLayout from "@/components/shared/PageLayout.tsx";
import { getLocations } from "@/services/supabase/queries.ts";
import { startOfWeek, endOfWeek, set } from "date-fns";
import { useSetAtom } from "jotai";
import { locationsAtom } from "@/atoms/locationAtoms.ts";

const getWeekRange = (date: Date) => {
  // start of the week (midnight)
  const startTime = set(startOfWeek(date, { weekStartsOn: 1 }), {
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });

  // end of the week (11:59:59.999 pm)
  const endTime = set(endOfWeek(date, { weekStartsOn: 1 }), {
    hours: 23,
    minutes: 59,
    seconds: 59,
    milliseconds: 999,
  });

  return { startTime, endTime };
};

const LocationsPage: React.FC = () => {
  const setLocations = useSetAtom(locationsAtom);

  useEffect(() => {
    const { startTime, endTime } = getWeekRange(new Date());
    getLocations(startTime.toISOString(), endTime.toISOString()).then(
      (locations) => setLocations(locations),
    );
  }, [setLocations]);

  return (
    <PageLayout>
      <LocationsMap />
    </PageLayout>
  );
};

export default LocationsPage;
