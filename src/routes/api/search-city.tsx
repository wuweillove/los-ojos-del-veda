import { createAPIFile } from "@tanstack/start/api";

export default createAPIFile({
  GET: async ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    if (!q || q.length < 3) return Response.json([]);
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=8`);
      const data = await r.json();
      return Response.json(data.map((d: any) => ({
        name: d.display_name.split(",").slice(0, 2).join(","),
        lat: +d.lat,
        lng: +d.lon,
        country: d.address?.country
      })));
    } catch {
      return Response.json([]);
    }
  },
});
