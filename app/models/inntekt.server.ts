import type { IUklassifisertInntekt } from "~/types/inntekt.types";
import { getDPInntektOboToken } from "~/utils/auth.util.server";
import { getEnv } from "~/utils/env.utils";

export type INetworkResponse<T = void> = INetworkResponseSuccess<T> | INetworkResponseError;

export interface INetworkResponseSuccess<T> {
  status: "success";
  data: T;
}

export interface INetworkResponseError {
  status: "error";
  error: {
    statusCode: number;
    statusText: string;
  };
}

export async function hentUklassifisertInntekt(
  request: Request,
  inntektId: string
): Promise<INetworkResponse<IUklassifisertInntekt>> {
  const url = `${getEnv("DP_INNTEKT_API_URL")}/v1/inntekt/uklassifisert/${inntektId}`;
  const onBehalfOfToken = await getDPInntektOboToken(request);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${onBehalfOfToken}`,
      connection: "keep-alive",
    },
  });

  if (!response.ok) {
    return {
      status: "error",
      error: {
        statusCode: response.status,
        statusText: "Feil ved uthenting av inntekt",
      },
    };
  }

  const data: IUklassifisertInntekt = await response.json();

  return {
    status: "success",
    data: data,
  };
}
