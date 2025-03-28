import {type LoaderFunctionArgs, useLoaderData} from "react-router";
import {mockResponseForHentingAvUklassifisertInntekt} from "~/utils/mock.server.response";
import {getDPInntektOboToken} from "~/utils/auth.server";

async function fetchVerdikoder(token: String) {
    //const url = `https://dp-inntekt-api.intern.dev.nav.no/v1/inntekt/verdikoder`;
    const url = `https://dp-inntekt-api.intern.dev.nav.no/v2/inntekt/klassifisert/01JFTM0H9MP3N5RH3H4VYB4GHH`;
    console.log(token + ": TOKEN");
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            connection: "keep-alive",
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
    var token = await getDPInntektOboToken(request);
    return await fetchVerdikoder(token);
  }

export default function Verdikoder() {
    const response = useLoaderData<typeof loader>();
    console.log(mockResponseForHentingAvUklassifisertInntekt);

    return (
        <>
            <h1>Dette er verdikoder siden</h1>
            <h1>RESPONS MOCK</h1>
            <p>{mockResponseForHentingAvUklassifisertInntekt.inntektId.id}</p>
        </>
        
    )
}