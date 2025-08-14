import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import axios from "npm:axios"
import { JSDOM } from "npm:jsdom"
import { Client } from "npm:@googlemaps/google-maps-services-js"
import { parse } from "npm:date-fns"
import { createClient } from "npm:@supabase/supabase-js@2";

const TARGET_URL = 'https://www.londonspuds.com.au/locations';
const DATE_PATTERN = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday) \d{1,2} (January|February|March|April|May|June|July|August|September|October|November|December) \d{4}$/;

const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY')
const mapsClient = new Client({})
const supabase = createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
)

async function geocodeAddress(address) {
  const response = await mapsClient.geocode({
    params: {
      address,
      key: apiKey
    }
  });

  if(response.data.status === 'OK' && response.data.results.length > 0) {
    const { lat, lng } = response.data.results[0].geometry.location;
    return { lat, lng };
  } else {
    throw new Error(`Geocoding failed: ${response.data.status}`)
  }
}

async function createLocation(locSchedule) {
  const { data: existingLoc, error: selectError } = await supabase
    .from('locations')
    .select()
    .eq('address', locSchedule.address)
    .maybeSingle();

  if(selectError) {
    throw new Error(`Failed to check existing location: ${selectError.message}`);
  }

  if(existingLoc) {
    return existingLoc;
  }

  const coords = await geocodeAddress(locSchedule.address);
  const { data: locations, error: insertError } = await supabase
    .from('locations')
    .insert({
      lat: coords.lat,
      lng: coords.lng,
      address: locSchedule.address,
    })
    .select();

  if(insertError) {
    throw new Error(`Failed to create location: ${insertError.message}`);
  }

  return locations[0]
}

const formats = [
  'EEEE d MMMM yyyy ha',     // e.g. Friday 15 August 2025 11am
  'EEEE d MMMM yyyy h:mma',  // e.g. Friday 15 August 2025 7:30pm
];

function parseFlexibleDate(dateTime) {
  for (const fmt of formats) {
    const parsed = parse(dateTime, fmt, new Date());
    if (!isNaN(parsed)) return parsed;
  }
  return null; // could not parse
}

function parseEntry(entry) {
  entry = entry.replace(/\u200b/g, "").trim();

  const pattern = /^(.+?)\s+(\d{1,2}(?::\d{2})?(?:am|pm))\s*-\s*(\d{1,2}(?::\d{2})?(?:am|pm))/i;
  const match = entry.match(pattern);

  if (!match) {
    return { address: null, startTime: null, endTime: null };
  }

  const [, address, startTime, endTime] = match;
  return { address: address.trim(), startTime, endTime };
}

Deno.serve(async (_req) => {
  const { data: html } = await axios.get(TARGET_URL);
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  const headings = doc.querySelectorAll('span.wixui-rich-text__text[style*="font-weight:bold;"]');
  const days = [...headings].map(el => el.textContent.toString()).filter(d => DATE_PATTERN.test(d))

  const ulElements = doc.querySelectorAll('ul.font_7.wixui-rich-text__text');
  const locationSchedules = [];

  for(const ul of ulElements) {
    const liTexts = Array.from(ul.querySelectorAll('li'))
      .map(li => li.textContent.trim())
      .map(parseEntry)
      .filter((item) => Boolean(item.address));
    locationSchedules.push(liTexts);
  }

  const daySchedule = {};
  const locations = {};

  for(let i = 0; i < days.length; i++) {
    daySchedule[days[i]] = await Promise.all(locationSchedules[i].map(async (locSched) => {
      let location = locations[locSched.address];
      if(!location) {
        location = await createLocation(locSched);
        locations[location.address] = location;
      }
      return {
        locationRef: location.id,
        startTime: locSched.startTime,
        endTime: locSched.endTime,
      };
    }));
  }

  const schedule = Object.keys(daySchedule).flatMap((day) => {
    const dayLocations = daySchedule[day];
    return dayLocations.map(loc => ({
      ...loc,
      startTime: parseFlexibleDate(`${day} ${loc.startTime}`),
      endTime: parseFlexibleDate(`${day} ${loc.endTime}`),
    }))
  })

  return new Response(
    JSON.stringify({
      locations: Object.values(locations),
      schedule
    }),
    { headers: { "Content-Type": "application/json" } },
  )
})
