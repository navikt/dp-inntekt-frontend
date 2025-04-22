import { http, HttpResponse } from "msw";
import { getEnv } from "~/utils/env.utils";
import { mockKlassifisertInntektResponse } from "./mock.hentInntekt.response";

export const handlers = [
  http.get(
    `${getEnv("DP_INNTEKT_API_URL")}/v2/inntekt/klassifisert/01JRFXF1J0V27WEWWGSBWJQ988`,
    () => {
      return HttpResponse.json(mockKlassifisertInntektResponse);
    }
  ),
];
