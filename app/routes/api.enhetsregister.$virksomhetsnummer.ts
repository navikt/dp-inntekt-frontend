import type { Route } from "./+types/api.enhetsregister.$virksomhetsnummer";
import { hentVirksomhetsNavn } from "~/models/inntekt.server";

export async function loader({ request, params }: Route.LoaderArgs) {

    if(!params.virksomhetsnummer) {
        return new Response("OrgNr is empty", {
            status: 404,
            headers: { "Content-Type": "application/text" },
        }); 
    }
    
    const response = await hentVirksomhetsNavn(params.virksomhetsnummer);
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