import {type LoaderFunctionArgs, useLoaderData} from "react-router";
import * as process from "node:process";


async function fetchVerdikoder() {
    const url = `${process.env.DP_INNTEKT_API_URL}/v1/inntekt/verdikoder`;
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