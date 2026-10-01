import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  allowedActionOrigins: ["**.nav.no"],
} satisfies Config;
