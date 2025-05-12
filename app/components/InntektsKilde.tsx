import { Button, ExpansionCard, VStack } from "@navikt/ds-react";
import { useRouteLoaderData } from "react-router";
import UtvidetIntektTabell from "~/components/UtvidetInntektTabell";
import type { loader } from "~/routes/_index";
import type { IPeriode, IVirksomhetsinntekt } from "~/types/inntekt.types";
import { formaterNorskDato, formatterNorskTall } from "~/utils/formattering.util";
import {
  finnTidligsteOgSenestePeriode,
  summerInntekter,
  sumTotalBelopForHelePeriode,
} from "~/utils/inntekt.util";

interface IProps {
  virksomhetsinntekt: IVirksomhetsinntekt;
  helePeriode: IPeriode;
}

interface IInntekInfo {
  overskrift: string;
  verdi: string;
}

export function InntektInfo({ overskrift, verdi }: IInntekInfo) {
  return (
    <VStack gap="0">
      <strong>{overskrift}</strong>
      <p>{verdi}</p>
    </VStack>
  );
}

export default function InntektsKilde({ virksomhetsinntekt, helePeriode }: IProps) {
  const { virksomhetsnummer, virksomhetsnavn, periode, inntekter } = virksomhetsinntekt;

  const indexRouteData = useRouteLoaderData<typeof loader>("routes/_index");

  if (indexRouteData?.uklassifisertInntekt.status === "error") {
    return <>Error</>;
  }

  return (
    <ExpansionCard aria-label="Demo med custom styling">
      <ExpansionCard.Header>
        <ExpansionCard.Title>{virksomhetsnavn || virksomhetsnummer}</ExpansionCard.Title>
        <ExpansionCard.Description>
          <VStack gap="4">
            <InntektInfo
              overskrift="Organisasjonsnummer"
              verdi={virksomhetsnummer || virksomhetsnummer}
            />
            <InntektInfo
              overskrift="Periode"
              verdi={`${formaterNorskDato(periode.fra)} - ${formaterNorskDato(periode.til)}`}
            />
            <InntektInfo
              overskrift="Beløp for perioden"
              // Todo: Bruk tallet fra backend isteden
              verdi={formatterNorskTall(summerInntekter(inntekter))}
            />
          </VStack>
        </ExpansionCard.Description>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        <UtvidetIntektTabell virksomhetsinntekt={virksomhetsinntekt} helePeriode={helePeriode} />
        <Button size="small" className="mt-4">
          Legg til inntekt
        </Button>
      </ExpansionCard.Content>
    </ExpansionCard>
  );
}
