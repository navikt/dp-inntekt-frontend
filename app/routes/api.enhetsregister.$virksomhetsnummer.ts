import {hentVirksomhetsNavn} from "~/models/inntekt.server";
import {getEnv} from "~/utils/env.utils";
import type {Route} from "./+types/api.enhetsregister.$virksomhetsnummer";

export async function loader({ params }: Route.LoaderArgs) {
  if (getEnv("NAIS_CLUSTER_NAME") !== "prod-gcp") {
    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!params.virksomhetsnummer) {
    return new Response("Virksomhetsnummer is empty", {
      status: 404,
      headers: { "Content-Type": "application/text" },
    });
  }

  const response = await hentVirksomhetsNavn(params.virksomhetsnummer);

  if (response.ok) {
    const virksomhetsinfo = await response.json();

    return new Response(JSON.stringify(virksomhetsinfo), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Not found", {
    status: 404,
    headers: { "Content-Type": "application/text" },
  });
}
