import { createAPIFile } from "@tanstack/start/api";
import { calcTransits } from "../../lib/jyotish-engine";

export default createAPIFile({
  GET: async () => {
    try {
      return Response.json({ transits: calcTransits() });
    } catch (e: any) {
      return Response.json({ error: e.message }, { status: 500 });
    }
  },
});
