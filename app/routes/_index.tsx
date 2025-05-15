import { Box, VStack } from "@navikt/ds-react";
import { redirect, useLoaderData } from "react-router";
import invariant from "tiny-invariant";
import { Header } from "~/components/Header";
import { InntektPerioderOppsummering } from "~/components/InntektPeriodeSum";
import InntektsKilde from "~/components/InntektsKilde";
import LeggTilInntektsKilde from "~/components/LeggTilInntektsKilde/LeggTilInntektsKilde";
import { Personalia } from "~/components/Personalia";
import { hentUklassifisertInntekt, lagreUklassifisertInntekt } from "~/models/inntekt.server";
import type { Route } from "./+types/_index";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);

  // Todo: fjern hardkodet inntektId
  // url.searchParams.set("inntektId", "01ARZ3NDEKTSV4RRFFQ69G5FAV");
  const inntektId = url.searchParams.get("inntektId");
  // Redirect hvis inntekts-ID mangler
  if (!inntektId) {
    return redirect("/sok");
  }

  invariant(inntektId, "Mangler inntekts-ID");
  const uklassifisertInntekt = await hentUklassifisertInntekt(request, inntektId);

  console.log(uklassifisertInntekt.status);

  if (uklassifisertInntekt.status === "error") {
    console.log("Error: ", uklassifisertInntekt.error);
  }

  if (uklassifisertInntekt.status === "success") {
    console.log("Success: ", uklassifisertInntekt.data);
  }

  return { uklassifisertInntekt };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const url = new URL(request.url);
  const inntektId = url.searchParams.get("inntektId");

  invariant(inntektId, "Mangler inntekts-ID");

  const oppdatertInntektId = await lagreUklassifisertInntekt(request, inntektId);
  if (oppdatertInntektId.status === "success") {
    console.log("oppdatertInntekt: ", oppdatertInntektId);
    return redirect(`/?inntektId=${oppdatertInntektId.data}`);
  }

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
