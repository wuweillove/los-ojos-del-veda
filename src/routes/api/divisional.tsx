import { createAPIFile } from "@tanstack/start/api";
import { computeChart, computeDivisional } from "../../lib/jyotish-engine";

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
    const division = +url.searchParams.get("division")!;
    
    try {
      const chart = computeChart(y, m, d, h, offset, lat, lng);
      const div = computeDivisional(chart, division);
      return Response.json({ division, chart: div });
    } catch (e: any) {
      return Response.json({ error: e.message }, { status: 500 });
    }
  },
});
