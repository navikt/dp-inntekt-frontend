import {type LoaderFunctionArgs, useLoaderData} from "react-router";


async function fetchVerdikoder() {
    const url = `https://dp-inntekt-api.intern.dev.nav.no/v1/inntekt/verdikoder`;
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
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
    return await fetchVerdikoder();
  }

export default function Verdikoder() {
    const response = useLoaderData<typeof loader>();
    console.log(response);

    return (
        <>
            <h1>Dette er verdikoder siden</h1>
            <p>{`${response}`}</p>
        </>
        
    )
}