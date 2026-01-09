import {redirect} from "react-router";
import type {Route} from "./+types/inntektId.$inntektId";

export async function loader({ request, params }: Route.LoaderArgs) {

  const aktørId = url.searchParams.get("aktorId");
  const vedtakId = url.searchParams.get("vedtakId");
  const beregningsdato = url.searchParams.get("beregningsdato");

  const id = dpInntekt.get(id)
  return redirect(`/inntektId/${id}?erArena=true`);

}

const dev = "https://dagpenger-inntekt.ansatt.dev.nav.no/inntekter?aktorId=123&vedtakId=456&beregningsdato=2023-01-01";
const prod = "https://dagpenger-inntekt.nav.no/inntekter?aktorId=123&vedtakId=456&beregningsdato=2023-01-01";