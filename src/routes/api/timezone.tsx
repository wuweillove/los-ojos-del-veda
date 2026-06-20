import { createAPIFile } from "@tanstack/start/api";

export default createAPIFile({
  GET: async ({ request }) => {
    const url = new URL(request.url);
    const lat = +(url.searchParams.get("lat") ?? 0);
    const lng = +(url.searchParams.get("lng") ?? 0);
    // Lógica de zona horaria simplificada para el endpoint
    const roughOffset = Math.round(lng / 15);
    return Response.json({ offset: roughOffset, name: `UTC${roughOffset >= 0 ? "+" : ""}${roughOffset}` });
  },
});
