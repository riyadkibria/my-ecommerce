import "dotenv/config";

import { supabase } from "./lib/supabase";
import { redxFetch } from "../lib/redx/client";

type RedxArea = {
  id: number;
  name: string;
  post_code: number;
  district_name: string;
  division_name: string;
  zone_id: number;
};

type RedxAreasResponse = {
  areas: RedxArea[];
};

async function getRedxAreas(): Promise<RedxArea[]> {
  const response =
    await redxFetch("/areas") as RedxAreasResponse;

  return response.areas;
}

async function syncDivisions(areas: RedxArea[]) {
  const divisionNames = [
    ...new Set(areas.map((a) => a.division_name)),
  ];

  const { error } = await supabase
    .from("divisions")
    .upsert(
      divisionNames.map((name) => ({ name })),
      {
        onConflict: "name",
      }
    );

  if (error) throw error;
}

async function loadDivisionMap() {
  const { data, error } = await supabase
    .from("divisions")
    .select("id,name");

  if (error) throw error;

  const map = new Map<string, number>();

  data.forEach((division) => {
    map.set(division.name, division.id);
  });

  return map;
}

async function syncDistricts(
  areas: RedxArea[],
  divisionMap: Map<string, number>
) {
  const uniqueDistricts = [
    ...new Set(
      areas.map(
        (a) => `${a.division_name}|${a.district_name}`
      )
    ),
  ];

  const districtsToInsert: {
    division_id: number;
    name: string;
  }[] = [];

  for (const pair of uniqueDistricts) {
    const [divisionName, districtName] =
      pair.split("|");

    const divisionId =
      divisionMap.get(divisionName);

    if (!divisionId) continue;

    districtsToInsert.push({
      division_id: divisionId,
      name: districtName,
    });
  }

  const { error } = await supabase
    .from("districts")
    .upsert(districtsToInsert, {
     onConflict: "division_id,name",
    });

  if (error) throw error;
}

async function loadDistrictMap() {
  const { data, error } = await supabase
    .from("districts")
    .select("id,name");

  if (error) throw error;

  const map = new Map<string, number>();

  data.forEach((district) => {
    map.set(district.name, district.id);
  });

  return map;
}

async function syncDeliveryAreas(
  areas: RedxArea[],
  districtMap: Map<string, number>
) {
  const deliveryAreas = [];

  for (const area of areas) {
    const districtId =
      districtMap.get(area.district_name);

    if (!districtId) continue;

    deliveryAreas.push({
      district_id: districtId,
      redx_area_id: area.id,
      name: area.name,
      post_code: area.post_code,
      zone_id: area.zone_id,
    });
  }

  const { error } = await supabase
    .from("delivery_areas")
    .upsert(deliveryAreas, {
      onConflict: "redx_area_id",
    });

  if (error) throw error;
}

async function syncLocations() {
  console.log("Downloading RedX Areas...");

  const areas = await getRedxAreas();

  console.log(
    `Downloaded ${areas.length} areas`
  );

  console.log("Syncing Divisions...");
  await syncDivisions(areas);

  console.log("Loading Division Map...");
  const divisionMap =
    await loadDivisionMap();

  console.log("Syncing Districts...");
  await syncDistricts(
    areas,
    divisionMap
  );

  console.log("Loading District Map...");
  const districtMap =
    await loadDistrictMap();

  console.log("Syncing Delivery Areas...");
  await syncDeliveryAreas(
    areas,
    districtMap
  );

  console.log("✅ Sync Complete");
}

syncLocations().catch(console.error);