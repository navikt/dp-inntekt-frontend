import { getEnv } from "~/utils/env.utils";
import type { Route } from "./+types/_index";

async function hentOrgNavn(organisasjonsnummer: string) {
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

export async function loader({ request, params }: Route.LoaderArgs) {

    if(!params.orgnr) {
        return new Response("OrgNr is empty", {
            status: 404,
            headers: { "Content-Type": "application/text" },
        }); 
    }

    
    const response = await hentOrgNavn(params.orgnr);
    if(response.ok) {
        const organisasjonsinfo = await response.json()
        return new Response(JSON.stringify(organisasjonsinfo), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        })
    } 

    return new Response("Not found", {
        status: 404,
        headers: { "Content-Type": "application/text" },
    });
}