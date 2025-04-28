import { ExpansionCard, VStack } from "@navikt/ds-react";
import UtvidetIntektTabell from "~/components/UtvidetInntektTabell";
import type { IInntektVirksomhetMaaned } from "~/types/inntekt.types";
import { formaterNorskDato, formatterNorskTall } from "~/utils/formattering.util";

interface VirksomhetExpansionProps {
  virksomhet: IInntektVirksomhetMaaned;
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

export default function InntektExpansionCard({ virksomhet }: VirksomhetExpansionProps) {
  return (
    <ExpansionCard aria-label="Demo med custom styling" className="mt-4">
      <ExpansionCard.Header>
        <ExpansionCard.Title>{virksomhet.virksomhetNavn}</ExpansionCard.Title>
        <ExpansionCard.Description>
          <VStack gap="4">
            <InntektInfo overskrift="Organisasjonsnummer" verdi={virksomhet.virksomhet} />
            <InntektInfo
              overskrift="Periode"
              verdi={`${formaterNorskDato(virksomhet.periode.fra)} - ${formaterNorskDato(
                virksomhet.periode.til
              )}`}
            />
            <InntektInfo
              overskrift="Beløp for perioden"
              verdi={formatterNorskTall(Number(virksomhet.totalBeløp))}
            />
          </VStack>
        </ExpansionCard.Description>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        <UtvidetIntektTabell />
      </ExpansionCard.Content>
    </ExpansionCard>
  );
}
