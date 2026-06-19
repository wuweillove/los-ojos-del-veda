import { Hono } from "hono";
import { cors } from "hono/cors";
import { computeChart, calcDashas } from "./lib/jyotish-engine";

const app = new Hono();
app.use("/api/*", cors());

app.get("/api/calculate", (c) => {
  const y = +c.req.query("year")!;
  const m = +c.req.query("month")!;
  const d = +c.req.query("day")!;
  const h = +c.req.query("hour")!;
  const offset = +c.req.query("offset")!;
  const lat = +c.req.query("lat")!;
  const lng = +c.req.query("lng")!;

  const chart = computeChart(y, m, d, h, offset, lat, lng);
  const dasha = calcDashas(chart);

  return c.json({ chart, dasha });
});

// City search proxy (avoids CORS)
app.get("/api/search-city", async (c) => {
  const q = c.req.query("q");
  if (!q || q.length < 3) return c.json([]);
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=8`);
    const data = await r.json();
    return c.json(data.map((d: any) => ({
      name: d.display_name.split(",").slice(0, 2).join(","),
      lat: +d.lat, lng: +d.lon
    })));
  } catch {
    return c.json([]);
  }
});

// Timezone proxy
app.get("/api/timezone", async (c) => {
  const lat = c.req.query("lat");
  const lng = c.req.query("lng");
  const date = c.req.query("date") || "2000-01-01";
  try {
    const r1 = await fetch(`https://timeapi.io/api/timezone/coordinate?latitude=${lat}&longitude=${lng}`);
    const d1 = await r1.json();
    const dateTime = `${date}T12:00:00`;
    const r2 = await fetch(`https://timeapi.io/api/conversion/converttimezone?sourceTimeZone=${encodeURIComponent(d1.timeZone)}&destinationTimeZone=UTC&dateTime=${dateTime}`);
    const d2 = await r2.json();
    const src = new Date(dateTime).getTime();
    const utc = new Date(d2.conversionResult.dateTime).getTime();
    const offset = (src - utc) / 3600000;
    return c.json({ offset, name: d1.timeZone });
  } catch {
    return c.json({ offset: 0, name: "UTC" });
  }
});

export default app;
