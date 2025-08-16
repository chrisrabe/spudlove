import { supabase } from "./client.ts";
import { parseISO, startOfToday, differenceInMilliseconds } from "date-fns";
import type { Location } from "@/types/location.ts";

export const getLocations = async (
  startDate: string,
  endDate: string,
): Promise<Location[]> => {
  const { data, error } = await supabase
    .from("schedules")
    .select(
      `
        start_time,
        end_time,
        locations:location_ref (
          lat,
          lng,
          address
        )
      `,
    )
    .gte("start_time", startDate)
    .lte("end_time", endDate);

  if (error) throw error;

  const today = startOfToday();

  // Flatten the structure
  const flattened =
    data?.map((item) => ({
      lat: item.locations.lat,
      lng: item.locations.lng,
      address: item.locations.address,
      start_time: item.start_time,
      end_time: item.end_time,
    })) ?? [];

  // Group by address and pick the schedule closest to today (past or future)
  const uniqueByAddress = Object.values(
    flattened.reduce(
      (acc, item) => {
        const startTime = parseISO(item.start_time);
        const key = item.address;

        if (!acc[key]) {
          acc[key] = item;
        } else {
          const existingStart = parseISO(acc[key].start_time);

          const diffExisting = Math.abs(
            differenceInMilliseconds(existingStart, today),
          );
          const diffNew = Math.abs(differenceInMilliseconds(startTime, today));

          if (diffNew < diffExisting) {
            acc[key] = item;
          }
        }

        return acc;
      },
      {} as Record<string, (typeof flattened)[number]>,
    ),
  );

  return uniqueByAddress;
};
