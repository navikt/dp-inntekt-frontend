import { http, HttpResponse } from "msw";
import { getEnv } from "~/utils/env.utils";
import {mockUklassifisertInntekt, mockUncachedUklassifisertInntekt} from "./mock.uklassifiert-inntekt";
import { mockOrganisasjonsinfo } from "~/mocks/mock.organisasjonsinfo";

export const handlers = [
  http.get(`${getEnv("DP_INNTEKT_API_URL")}/v1/inntekt/uklassifisert/:inntektId`, () => {
    return HttpResponse.json(mockUklassifisertInntekt);
  }),
  http.post(`${getEnv("DP_INNTEKT_API_URL")}/v1/inntekt/uklassifisert/:inntektId`, () => {
    return HttpResponse.text("1234");
  }),
  http.get(`${getEnv("DP_INNTEKT_API_URL")}/v1/enhetsregisteret/enhet/:virksomhetsnummer`, () => {
    return HttpResponse.json(mockOrganisasjonsinfo);
  }),
  http.get(`${getEnv("DP_INNTEKT_API_URL")}/v1/inntekt/uklassifisert/uncached/:inntektId`, () => {
    return HttpResponse.json(mockUncachedUklassifisertInntekt);
  }),
  http.get(`${getEnv("DP_INNTEKT_API_URL")}/v3/inntekt/inntektId/:aktorId/:kontekstType/:kontekstId/:beregningsDato`, () => {
    return HttpResponse.text("1234");
  }),
];
