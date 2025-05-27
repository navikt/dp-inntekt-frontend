import { Button, ExpansionCard, VStack } from "@navikt/ds-react";
import VirsomhetInntekter from "~/components/VirsomhetInntekter";
import type { IPeriode, IVirksomhetsinntekt } from "~/types/inntekt.types";
import { formaterNorskDato, formatterNorskTall } from "~/utils/formattering.util";
import { erPersonnummer, maskerePersonnummer } from "~/utils/generell.util";

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
  const erPrivatPerson = erPersonnummer(virksomhetsnummer);

  return (
    <ExpansionCard aria-label={`Inntekt for ${virksomhetsnummer}`}>
      <ExpansionCard.Header>
        <ExpansionCard.Title>
          {erPrivatPerson ? "Privatperson" : virksomhetsnavn}
        </ExpansionCard.Title>
        <ExpansionCard.Description>
          <VStack gap="4">
            <InntektInfo
              overskrift={erPrivatPerson ? "Personnummer" : "Organisasjonsnummer"}
              verdi={erPrivatPerson ? maskerePersonnummer(virksomhetsnummer) : virksomhetsnummer}
            />
            <InntektInfo
              overskrift="Periode"
              verdi={`${formaterNorskDato(periode.fra)} - ${formaterNorskDato(periode.til)}`}
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
