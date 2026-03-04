import {redirect} from "react-router";
import type {Route} from "./+types/inntektId.$inntektId";
import {hentInntektId} from "~/models/inntekt.server";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);

  const aktørId = url.searchParams.get("aktorId");
  const vedtakId = url.searchParams.get("vedtakId");
  const beregningsdato = url.searchParams.get("beregningsdato");

  // kontekstType kan være både "vedtak" og "saksbehandling" i backend,
  //  men "vedtak" er det som brukes av Arena, så vi kan hardkode det her
  const inntektIdResponse = await hentInntektId(request, aktørId!, "vedtak", vedtakId!, beregningsdato!);

  if (!inntektIdResponse.ok) {
    throw new Response("Feil ved henting av inntekter", {
      status: inntektIdResponse.status,
      statusText: inntektIdResponse.statusText,
    });
  }

  const inntektId = await inntektIdResponse.text();

  return redirect(`/inntektId/${inntektId}?erArena=true`);

}
