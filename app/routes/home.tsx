import {Link, type LoaderFunctionArgs, useLoaderData} from "react-router";


async function fetchVerdikoder() {
  const url = `https://dp-inntekt-api.intern.dev.nav.no/v1/inntekt/verdikoder`;
  const response = await fetch(url)

  if (!response.ok) {
    throw new Response(`Feil ved kall til ${url}`, {
      status: response.status,
      statusText: response.statusText,
    });
  }

  return await response.json();
}

export const loader = async () => {
  const response = await fetchVerdikoder();
  return response;
}

export default function Home() {
  const response = useLoaderData<typeof loader>();

  return (
    <>
      <h1>HOME</h1>
      <h2>response</h2>
      <Link to="verdikoder">Verdikoder</Link>
      <p>{response}</p>
    </>
  )
}
