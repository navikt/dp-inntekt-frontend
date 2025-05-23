import { Button, ExpansionCard, VStack } from "@navikt/ds-react";
import VirsomhetInntekter from "~/components/VirsomhetInntekter";
import type { IPeriode, IVirksomhetsinntekt } from "~/types/inntekt.types";
import { formaterNorskDato, formatterNorskTall } from "~/utils/formattering.util";

interface IProps {
  virksomhet: IVirksomhetsinntekt;
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

export default function Virksomhet({ virksomhet, inntektsPeriode }: IProps) {
  const { virksomhetsnummer, virksomhetsnavn, periode, totalBelop } = virksomhet;

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
              verdi={`${formaterNorskDato(periode.til)} - ${formaterNorskDato(periode.fra)}`}
            />
            <InntektInfo
              overskrift="Beløp for perioden"
              verdi={formatterNorskTall(Number(totalBelop))}
            />
          </VStack>
        </ExpansionCard.Description>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        <VirsomhetInntekter virksomhet={virksomhet} inntektsPeriode={inntektsPeriode} />
        <Button size="small" className="mt-4">
          Legg til inntekt
        </Button>
      </ExpansionCard.Content>
    </ExpansionCard>
  );
}
