import { getDPInntektOboToken } from "~/utils/auth.util.server";
import { getEnv } from "~/utils/env.utils";

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

  return await fetch(url, {
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

  return await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${onBehalfOfToken}`,
      connection: "keep-alive",
    },
  });
}

export async function hentInntektId(request: Request, aktørId: string, kontekstType: string, kontekstId: string, beregningsDato: string) {
  const url = `${getEnv("DP_INNTEKT_API_URL")}/v3/inntekt/inntektId/${aktørId}/${kontekstType}/${kontekstId}/${beregningsDato}`;
  const onBehalfOfToken = await getDPInntektOboToken(request);

  return await fetch(url, {
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
  return await fetch(url, {
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

  return await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${onBehalfOfToken}`,
      connection: "keep-alive",
    },
  });
}
