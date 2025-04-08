import { BodyShort, Box, VStack } from "@navikt/ds-react";
import { useLoaderData } from "react-router";
import { Header } from "~/components/Header";
import InntektExpansionCard from "~/components/InntektExpansionCard";
import { InntektPeriodeSum } from "~/components/InntektPeriodeSum";
import LeggTilInntektsKildeModal from "~/components/LeggTilInntektskildeModal";
import { Personalia } from "~/components/Personalia";
import { mockResponseForHentingAvUklassifisertInntekt } from "~/utils/mock.server.response";

export async function loader() {
  const data = [
    {
      virksomhetsnummer: "924567834",
      navn: "Grav og Spreng AS",
      periode: {
        fra: new Date("2024-02-01"),
        til: new Date("2024-10-01"),
      },
      inntekter: [
        {
          inntektstype: "Timelønn",
          kilde: "A-Inntekt",
          sistOppdatert: "00.00.0000",
          redigert: "Nei",
          begrunnelse: "-",
          b: "-",
          beløp: "184 500kr",
        },
        {
          inntektstype: "Elektronisk kommunikasjon",
          kilde: "A-Inntekt",
          sistOppdatert: "00.00.0000",
          redigert: "Ja",
          begrunnelse: "Dårlige data",
          b: "-",
          beløp: "1 400kr",
        },
      ],
    },
    {
      virksomhetsnummer: "924567836",
      navn: "Rema",
      periode: {
        fra: new Date("2022-11-01"),
        til: new Date("2025-03-01"),
      },
      inntekter: [
        {
          inntektstype: "Timelønn",
          kilde: "A-Inntekt",
          sistOppdatert: "00.00.0000",
          redigert: "Nei",
          begrunnelse: "-",
          b: "-",
          beløp: "59 500kr",
        },
      ],
    },
  ];

  return { data };
}

export default function Index() {
  const { data } = useLoaderData<typeof loader>();

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
      <Header tittel="Dagpenger inntekt" />
      <Personalia navn={navn} pnr={pnr} sistOppdatert={sisteOppdatert} />
      <Box background="surface-default" padding="6" borderRadius="xlarge">
        <InntektPeriodeSum fom={fom} tom={tom} sum={sum} />
        {data.map((virksomhet) => (
          <InntektExpansionCard key={virksomhet.virksomhetsnummer} virksomhet={virksomhet} />
        ))}
        <LeggTilInntektsKildeModal />
      </Box>
    </main>
  );
}
