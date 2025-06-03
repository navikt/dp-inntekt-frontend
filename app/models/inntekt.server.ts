import type { IUklassifisertInntekt } from "~/types/inntekt.types";
import { getDPInntektOboToken } from "~/utils/auth.util.server";
import { getEnv } from "~/utils/env.utils";

export async function lagreInntekt(
  request: Request,
  inntektId: string,
  oppdaterteInntektData: IUklassifisertInntekt
) {
  const url = `${getEnv("DP_INNTEKT_API_URL")}/v1/inntekt/uklassifisert/${inntektId}`;
  const onBehalfOfToken = await getDPInntektOboToken(request);

  return await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${onBehalfOfToken}`,
      connection: "keep-alive",
    },
    body: JSON.stringify(oppdaterteInntektData),
  });
}

export async function hentInntek(request: Request, inntektId: string) {
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

export async function hentOrgNavn(organisasjonsnummer: string) {
  const url = `${getEnv("DP_INNTEKT_API_URL")}/v1/enhetsregisteret/enhet/${organisasjonsnummer}`;
    return await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      connection: "keep-alive",
    },
  });  
}