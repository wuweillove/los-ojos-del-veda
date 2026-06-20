import { defineNitroConfig } from "nitropack/config";

export default defineNitroConfig({
  externals: {
    inline: ["sweph"],
    trace: true
  },
  publicAssets: [
    {
      dir: "public/ephe",
      maxAge: 31536000
    }
  ]
});
