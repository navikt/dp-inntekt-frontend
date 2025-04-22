import { getDPInntektOboToken } from "~/utils/auth.server";
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

export async function hentInntekt(request: Request): Promise<INetworkResponse<[]>> {
  const url = `${getEnv("DP_INNTEKT_API_URL")}/v2/inntekt/klassifisert/01JFTM0H9MP3N5RH3H4VYB4GHH`;
  const onBehalfOfToken = await getDPInntektOboToken(request);

  console.log(url);
  console.log(onBehalfOfToken);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${onBehalfOfToken}`,
      connection: "keep-alive",
    },
  });

  console.log(response);

  if (!response.ok) {
    return {
      status: "error",
      error: {
        statusCode: response.status,
        statusText: "Feil ved uthenting av inntekt",
      },
    };
  }

  const data: [] = await response.json();

  console.log("msw;", data);

  const mappedDate = [
    {
      virksomhetsnummer: "924567834",
      navn: "Grav og Spreng AS",
      periode: {
        fra: new Date("2024-02-01"),
        til: new Date("2024-10-01"),
      },
      inntekter: [
        {
          inntektstype: "Timelønn",
          kilde: "A-Inntekt",
          sistOppdatert: "00.00.0000",
          redigert: "Nei",
          begrunnelse: "-",
          b: "-",
          beløp: "184 500kr",
        },
        {
          inntektstype: "Elektronisk kommunikasjon",
          kilde: "A-Inntekt",
          sistOppdatert: "00.00.0000",
          redigert: "Ja",
          begrunnelse: "Dårlige data",
          b: "-",
          beløp: "1 400kr",
        },
      ],
    },
    {
      virksomhetsnummer: "924567836",
      navn: "Rema",
      periode: {
        fra: new Date("2022-11-01"),
        til: new Date("2025-03-01"),
      },
      inntekter: [
        {
          inntektstype: "Timelønn",
          kilde: "A-Inntekt",
          sistOppdatert: "00.00.0000",
          redigert: "Nei",
          begrunnelse: "-",
          b: "-",
          beløp: "59 500kr",
        },
      ],
    },
  ];

  return {
    status: "success",
    data: [],
  };
}
