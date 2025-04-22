import { Box, HStack, VStack } from "@navikt/ds-react";
import { useLoaderData } from "react-router";
import { Header } from "~/components/Header";
import InntektExpansionCard from "~/components/InntektExpansionCard";
import { InntektPeriodeSum } from "~/components/InntektPeriodeSum";
import LeggTilInntektsKildeModal from "~/components/LeggTilInntektskildeModal";
import { Personalia } from "~/components/Personalia";
import { hentInntekt } from "~/models/inntekt.server";
import { mockResponseForHentingAvUklassifisertInntekt } from "~/mocks/mock.hentInntekt.response";
import type { Route } from "./+types/_index";

export async function loader({ request }: Route.LoaderArgs) {
  console.log(" 🔥hit loader");
  const inntekt = await hentInntekt(request);

  return { inntekt };
}

export default function Index() {
  const { inntekt } = useLoaderData<typeof loader>();

  console.log(inntekt);

  const navn = mockResponseForHentingAvUklassifisertInntekt.inntektsmottaker.navn;
  const pnr = mockResponseForHentingAvUklassifisertInntekt.inntektsmottaker.pnr;
  const sisteOppdatert = "21.03.2025, kl 12:04";

  function hentInntektPeriodeSum() {
    return {
      fom: "Mars 2022",
      tom: "Mars 2025",
      sum: 867000,
    };
  }

  const { fom, tom, sum } = hentInntektPeriodeSum();

  return (
    <main>
      <VStack gap="6">
        <Header tittel="Dagpenger inntekt" />
        <Personalia navn={navn} pnr={pnr} sistOppdatert={sisteOppdatert} />
        {/* <Box background="surface-default" padding="6" borderRadius="xlarge">
          <InntektPeriodeSum fom={fom} tom={tom} sum={sum} />
          {inntekt.map((virksomhet) => (
            <InntektExpansionCard key={virksomhet.virksomhetsnummer} virksomhet={virksomhet} />
          ))}
          <LeggTilInntektsKildeModal />
        </Box> */}
      </VStack>
    </main>
  );
}
