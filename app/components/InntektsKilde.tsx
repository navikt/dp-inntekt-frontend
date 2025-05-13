import { Button, ExpansionCard, VStack } from "@navikt/ds-react";
import UtvidetIntektTabell from "~/components/UtvidetInntektTabell";
import type { IPeriode, IVirksomhetsinntekt } from "~/types/inntekt.types";
import { formaterNorskDato, formatterNorskTall } from "~/utils/formattering.util";
import { summerInntekter } from "~/utils/inntekt.util";

interface IProps {
  virksomhetsinntekt: IVirksomhetsinntekt;
  inntektsPeriode: IPeriode;
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

export default function InntektsKilde({ virksomhetsinntekt, inntektsPeriode }: IProps) {
  const { virksomhetsnummer, virksomhetsnavn, periode, inntekter } = virksomhetsinntekt;

  return (
    <ExpansionCard aria-label={`Inntekt for ${virksomhetsnavn}`}>
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
              verdi={formatterNorskTall(summerInntekter(inntekter))}
            />
          </VStack>
        </ExpansionCard.Description>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        <UtvidetIntektTabell
          virksomhetsinntekt={virksomhetsinntekt}
          inntektsPeriode={inntektsPeriode}
        />
        <Button size="small" className="mt-4">
          Legg til inntekt
        </Button>
      </ExpansionCard.Content>
    </ExpansionCard>
  );
}
