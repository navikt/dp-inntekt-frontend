import {type LoaderFunctionArgs, useLoaderData} from "react-router";
import {mockResponseForHentingAvUklassifisertInntekt} from "~/utils/mock.server.response";

async function fetchVerdikoder() {
    const url = `https://dp-inntekt-api.intern.dev.nav.no/v1/inntekt/verdikoder`;

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer token`,
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {

      throw new Response(`Feil ved kall til ${url}`, {
        status: response.status,
        statusText: response.statusText,
      });
    }

    return await response.json();
  }

  export const loader = async ({params, request}: LoaderFunctionArgs) => {
    const response = await fetchVerdikoder();
    return response;
  }

export default function Verdikoder() {
    const response = useLoaderData<typeof loader>();
    console.log(mockResponseForHentingAvUklassifisertInntekt);

    return (
        <>
            <h1>Dette er verdikoder siden</h1>
            <p>{response}</p>
            <h1>RESPONS MOCK</h1>
            <p>{mockResponseForHentingAvUklassifisertInntekt.inntektId.id + ""}</p>
        </>
        
    )
}