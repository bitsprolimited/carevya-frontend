import { z } from "zod";


export const NIGERIA_LGAS_URL =
  "https://temikeezy.github.io/nigeria-geojson-data/data/lgas.json";

const nigeriaLgasSchema = z.record(z.string(), z.array(z.string().min(1)));

export type NigeriaLocationsMap = Record<string, string[]>;

export type NigeriaLocations = {
  states: string[];
  lgasByState: NigeriaLocationsMap;
};

function sortLocale(a: string, b: string) {
  return a.localeCompare(b, "en", { sensitivity: "base" });
}

export async function fetchNigeriaLocations(): Promise<NigeriaLocations> {
  const response = await fetch(NIGERIA_LGAS_URL, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to load Nigerian locations (${String(response.status)})`,
    );
  }

  const payload: unknown = await response.json();
  const parsed = nigeriaLgasSchema.safeParse(payload);

  if (!parsed.success) {
    throw new Error("Nigerian locations response was invalid");
  }

  const lgasByState: NigeriaLocationsMap = {};
  for (const [state, lgas] of Object.entries(parsed.data)) {
    lgasByState[state] = [...lgas].sort(sortLocale);
  }

  return {
    states: Object.keys(lgasByState).sort(sortLocale),
    lgasByState,
  };
}