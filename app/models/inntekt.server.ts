import { getDPInntektOboToken } from "~/utils/auth.util.server";
import { getEnv } from "~/utils/env.utils";

async function timedFetch(label: string, url: string, options: RequestInit): Promise<Response> {
  const start = performance.now();
  const response = await fetch(url, options);
  const duration = (performance.now() - start).toFixed(2);
  const maskedUrl = url.slice(0, -4) + "****";
  console.log(`[timer] ${label} – ${duration}ms (${maskedUrl})`);
  return response;
}

export async function lagreInntekt(
  request: Request,
  inntektId: string,
  behandlingId: string,
  opplysningId: string,
  erArena: string,
  payload: string
) {
  const url = `${getEnv("DP_INNTEKT_API_URL")}/v1/inntekt/uklassifisert/${inntektId}?behandlingId=${behandlingId}&opplysningId=${opplysningId}&erArena=${erArena}`;
  const onBehalfOfToken = await getDPInntektOboToken(request);

  return await timedFetch("lagreInntekt", url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${onBehalfOfToken}`,
      connection: "keep-alive",
    },
    body: payload,
  });
}

export async function hentInntekt(request: Request, inntektId: string) {
  const url = `${getEnv("DP_INNTEKT_API_URL")}/v1/inntekt/uklassifisert/${inntektId}`;
  const onBehalfOfToken = await getDPInntektOboToken(request);

  return await timedFetch("hentInntekt", url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${onBehalfOfToken}`,
      connection: "keep-alive",
    },
  });
}

export async function hentInntektId(
  request: Request,
  aktørId: string,
  kontekstType: string,
  kontekstId: string,
  beregningsDato: string
) {
  const url = `${getEnv("DP_INNTEKT_API_URL")}/v3/inntekt/inntektId/${aktørId}/${kontekstType}/${kontekstId}/${beregningsDato}`;
  const onBehalfOfToken = await getDPInntektOboToken(request);

  return await timedFetch("hentInntektId", url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${onBehalfOfToken}`,
      connection: "keep-alive",
    },
  });
}

export async function hentVirksomhetsNavn(virksomhetsnummer: string) {
  const url = `${getEnv("DP_INNTEKT_API_URL")}/v1/enhetsregisteret/enhet/${virksomhetsnummer}`;
  return await timedFetch("hentVirksomhetsNavn", url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      connection: "keep-alive",
    },
  });
}

export async function hentUncachedInntekt(request: Request, inntektId: string) {
  const url = `${getEnv("DP_INNTEKT_API_URL")}/v1/inntekt/uklassifisert/uncached/${inntektId}`;
  const onBehalfOfToken = await getDPInntektOboToken(request);

  return await timedFetch("hentUncachedInntekt", url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${onBehalfOfToken}`,
      connection: "keep-alive",
    },
  });
}
