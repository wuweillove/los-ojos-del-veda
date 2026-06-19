import { serveStatic } from "hono/bun";
import { Hono } from "hono";
import config from "./zosite.json";
import { computeChart, calcDashas, calcAspects, calcAshtakavarga, calcYogas, calcTransits, computeDivisional, calcPanchanga, calcKarakas, calcShadBala, calcArudhas, calcBhriguBindu, buildChartPoints, calcUpagrahas, calcSpecialLagnas } from "./src/lib/jyotish-engine";

const app = new Hono();

app.get("/api/calculate", (c) => {
  const y = +c.req.query("year")!, m = +c.req.query("month")!, d = +c.req.query("day")!, h = +c.req.query("hour")!, offset = +c.req.query("offset")!, lat = +c.req.query("lat")!, lng = +c.req.query("lng")!;
  try {
    const chart = computeChart(y, m, d, h, offset, lat, lng), dasha = calcDashas(chart), aspects = calcAspects(chart.planets, chart.lagnaRasi), av = calcAshtakavarga(chart), yogas = calcYogas(chart), panchanga = calcPanchanga(chart.jd, lat, lng), karakas = calcKarakas(chart), shadbala = calcShadBala(chart), arudhas = calcArudhas(chart), bb = calcBhriguBindu(chart), chartPoints = buildChartPoints(chart, arudhas, bb), upagrahas = calcUpagrahas(chart, lat, lng), specialLagnas = calcSpecialLagnas(chart, lat, lng);
    return c.json({ chart, dasha, aspects, ashtakavarga: av, yogas, panchanga, karakas, shadbala, arudhas, bb, chartPoints, upagrahas, specialLagnas });
  } catch (e: any) { return c.json({ error: e.message }, 500); }
});

app.get("/api/divisional", (c) => {
  const y = +c.req.query("year")!, m = +c.req.query("month")!, d = +c.req.query("day")!, h = +c.req.query("hour")!, offset = +c.req.query("offset")!, lat = +c.req.query("lat")!, lng = +c.req.query("lng")!, division = +c.req.query("division")!;
  try {
    const chart = computeChart(y, m, d, h, offset, lat, lng), div = computeDivisional(chart, division);
    return c.json({ division, chart: div });
  } catch (e: any) { return c.json({ error: e.message }, 500); }
});

app.get("/api/transits", (c) => { try { return c.json({ transits: calcTransits() }); } catch (e: any) { return c.json({ error: e.message }, 500); } });

app.get("/api/search-city", async (c) => {
  const q = c.req.query("q");
  if (!q || q.length < 3) return c.json([]);
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=8`), data = await r.json();
    return c.json(data.map((d: any) => ({ name: d.display_name.split(",").slice(0, 2).join(","), lat: +d.lat, lng: +d.lon, country: d.address?.country })));
  } catch { return c.json([]); }
});

app.get("/api/timezone", async (c) => {
  const lat = +(c.req.query("lat") ?? 0), lng = +(c.req.query("lng") ?? 0);
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=6`, { signal: AbortSignal.timeout(5000) }), d = await r.json(), country = d.address?.country_code?.toUpperCase();
    const tzMap: Record<string,[number,string]> = { "VE":[-4,"America/Caracas"], "CO":[-5,"America/Bogota"], "EC":[-5,"America/Guayaquil"], "PE":[-5,"America/Lima"], "BO":[-4,"America/La_Paz"], "CL":[-4,"America/Santiago"], "AR":[-3,"America/Buenos_Aires"], "BR":[-3,"America/Sao_Paulo"], "UY":[-3,"America/Montevideo"], "PY":[-4,"America/Asuncion"], "MX":[-6,"America/Mexico_City"], "US":[-5,"America/New_York"], "CA":[-5,"America/Toronto"], "ES":[1,"Europe/Madrid"], "FR":[1,"Europe/Paris"], "DE":[1,"Europe/Berlin"], "GB":[0,"Europe/London"], "IT":[1,"Europe/Rome"], "IN":[5.5,"Asia/Kolkata"], "CN":[8,"Asia/Shanghai"], "JP":[9,"Asia/Tokyo"], "AU":[10,"Australia/Sydney"], "NZ":[12,"Pacific/Auckland"], "PT":[0,"Europe/Lisbon"], "NL":[1,"Europe/Amsterdam"], "SE":[1,"Europe/Stockholm"], "NO":[1,"Europe/Oslo"], "DK":[1,"Europe/Copenhagen"], "PL":[1,"Europe/Warsaw"], "GR":[2,"Europe/Athens"], "TR":[3,"Europe/Istanbul"], "EG":[2,"Africa/Cairo"], "ZA":[2,"Africa/Johannesburg"], "NG":[1,"Africa/Lagos"], "KE":[3,"Africa/Nairobi"], "TH":[7,"Asia/Bangkok"], "VN":[7,"Asia/Ho_Chi_Minh"], "KR":[9,"Asia/Seoul"], "ID":[7,"Asia/Jakarta"], "MY":[8,"Asia/Kuala_Lumpur"], "SG":[8,"Asia/Singapore"], "TW":[8,"Asia/Taipei"], "PH":[8,"Asia/Manila"], "PK":[5,"Asia/Karachi"], "BD":[6,"Asia/Dhaka"], "RU":[3,"Europe/Moscow"], "UA":[2,"Europe/Kyiv"], "IL":[2,"Asia/Jerusalem"], "AE":[4,"Asia/Dubai"], "SA":[3,"Asia/Riyadh"], "IQ":[3,"Asia/Baghdad"], "IR":[3.5,"Asia/Tehran"], "AF":[4.5,"Asia/Kabul"] };
    if (country && tzMap[country]) return c.json({ offset: tzMap[country][0], name: tzMap[country][1] });
  } catch {}
  const roughOffset = Math.round(lng / 15);
  return c.json({ offset: roughOffset, name: `UTC${roughOffset >= 0 ? "+" : ""}${roughOffset}` });
});

// Explicit static serving for the 3D directory
app.get("/3d", (c) => c.redirect("/3d/", 301));
app.get("/3d/*", serveStatic({ root: "./dist" }));

app.use("/assets/*", serveStatic({ root: "./dist" }));
app.get("/favicon.ico", (c) => c.redirect("/favicon.svg", 302));
app.get("*", serveStatic({ path: "./dist/index.html" }));

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : config.local_port;
export default { fetch: app.fetch, port, idleTimeout: 255 };
