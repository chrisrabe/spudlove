import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import axios from "npm:axios"
import { JSDOM } from "npm:jsdom"

const TARGET_URL = 'https://www.londonspuds.com.au/locations';
const DATE_PATTERN = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday) \d{1,2} (January|February|March|April|May|June|July|August|September|October|November|December) \d{4}$/;

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
      .filter(Boolean);
    locationSchedules.push(liTexts);
  }

  const schedule = {};
  for(let i = 0; i < days.length; i++) {
    schedule[days[i]] = locationSchedules[i];
  }

  const locations = new Set(locationSchedules.flat().map(l => l.address))

  return new Response(
    JSON.stringify({
      locations: [...locations],
      schedule
    }),
    { headers: { "Content-Type": "application/json" } },
  )
})
