import type { Config } from "vike/types";
import vikeReact from "vike-react/config";

const isSpa = (process.env.VITE_APP_MODE ?? "ssr") === "spa";

export default {
  prerender: true,
  extends: [vikeReact],
  ssr: !isSpa,
} satisfies Config;
