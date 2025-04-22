import { http, HttpResponse } from "msw";
import { getEnv } from "~/utils/env.utils";
import { mockResponseForHentingAvUklassifisertInntekt } from "./mock.hentInntekt.response";

export const handlers = [
  http.get(
    `${getEnv("DP_INNTEKT_API_URL")}/v2/inntekt/klassifisert/01JFTM0H9MP3N5RH3H4VYB4GHH`,
    () => {
      return HttpResponse.json(mockResponseForHentingAvUklassifisertInntekt);
    }
  ),
];
