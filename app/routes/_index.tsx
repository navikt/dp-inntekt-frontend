import { Box, VStack } from "@navikt/ds-react";
import { redirect, useLoaderData } from "react-router";
import invariant from "tiny-invariant";
import { Header } from "~/components/Header";
import { InntektPerioderOppsummering } from "~/components/InntektPeriodeSum";
import InntektsKilde from "~/components/InntektsKilde";
import LeggTilInntektsKilde from "~/components/LeggTilInntektsKilde/LeggTilInntektsKilde";
import { Personalia } from "~/components/Personalia";
import { hentUklassifisertInntekt } from "~/models/inntekt.server";
import type { Route } from "./+types/_index";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);

  // Todo: fjern hardkodet inntektsId
  // url.searchParams.set("inntektsId", "01ARZ3NDEKTSV4RRFFQ69G5FAV");
  const inntektsId = url.searchParams.get("inntektsId");

  // Redirect hvis inntekts-ID mangler
  if (!inntektsId) {
    return redirect("/sok");
  }

  invariant(inntektsId, "Mangler inntekts-ID");
  const uklassifisertInntekt = await hentUklassifisertInntekt(request, inntektsId);

  return { uklassifisertInntekt };
}

export async function action({ request }: Route.ActionArgs) {
  let formData = await request.formData();

  console.log(`🔥 formData :`, formData);

  return {};
}

export default function Index() {
  const { uklassifisertInntekt } = useLoaderData<typeof loader>();

  if (uklassifisertInntekt.status === "error") {
    return <>Error page</>;
  }

  return (
    <main>
      <VStack gap="6">
        <Header tittel="Dagpenger inntekt" />
        <Personalia mottaker={uklassifisertInntekt.data.mottaker} />
        <Box background="surface-default" padding="6" borderRadius="xlarge">
          <InntektPerioderOppsummering
            virksomhetsinntekt={uklassifisertInntekt.data.virksomhetsinntekt}
            inntektsPeriode={uklassifisertInntekt.data.periode}
          />
        </Box>
        <Box background="surface-default" padding="6" borderRadius="xlarge">
          <VStack gap="4">
            {uklassifisertInntekt.data.virksomhetsinntekt.map((virksomhet) => (
              <InntektsKilde
                key={virksomhet.virksomhetsnummer}
                virksomhetsinntekt={virksomhet}
                inntektsPeriode={uklassifisertInntekt.data.periode}
              />
            ))}
          </VStack>
          <LeggTilInntektsKilde />
        </Box>
      </VStack>
    </main>
  );
}
