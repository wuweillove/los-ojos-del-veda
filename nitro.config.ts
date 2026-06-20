import { defineNitroConfig } from "nitropack/config";

export default defineNitroConfig({
  externals: {
    inline: ["sweph"],
    trace: true
  }
});
