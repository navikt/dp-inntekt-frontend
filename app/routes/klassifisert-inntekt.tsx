import { type LoaderFunctionArgs, useLoaderData } from "react-router";
import { getDPInntektOboToken } from "~/utils/auth.server";

async function fetchKlassifisertInntekt(token: String) {
  const url = `${process.env.DP_INNTEKT_API_URL}/v2/inntekt/klassifisert/01JFTM0H9MP3N5RH3H4VYB4GHH`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      connection: "keep-alive",
    },
  });

  if (!response.ok) {
    throw new Response(`Feil ved kall til ${url}`, {
      status: response.status,
      statusText: response.statusText,
    });
  }

  return await response.json();
}

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  var token = await getDPInntektOboToken(request);
  return await fetchKlassifisertInntekt(token);
};

export default function KlassifisertInntekt() {
  const response = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Dette er klassifiser inntekt siden</h1>
      <p>{response.inntektsId}</p>
    </>
  );
}
