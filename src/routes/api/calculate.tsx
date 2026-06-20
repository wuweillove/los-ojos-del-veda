import { createRequire } from "module";
const require = createRequire(import.meta.url);
const sweph = require("sweph");
import { createAPIFile } from "@tanstack/start/api";
import { computeChart, calcDashas, calcPanchanga } from "../../lib/jyotish-engine";

export default createAPIFile({
  GET: async ({ request }) => {
    const url = new URL(request.url);
    const y = +url.searchParams.get("year")!;
    const m = +url.searchParams.get("month")!;
    const d = +url.searchParams.get("day")!;
    const h = +url.searchParams.get("hour")!;
    const offset = +url.searchParams.get("offset")!;
    const lat = +url.searchParams.get("lat")!;
    const lng = +url.searchParams.get("lng")!;
    
    try {
      const chart = computeChart(y, m, d, h, offset, lat, lng);
      const dasha = calcDashas(chart);
      const panchanga = calcPanchanga(chart.jd, lat, lng);
      return Response.json({ chart, dasha, panchanga });
    } catch (e: any) {
      return Response.json({ error: e.message }, { status: 500 });
    }
  },
});
