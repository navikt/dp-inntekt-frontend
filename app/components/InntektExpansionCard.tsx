import { Button, ExpansionCard, VStack } from "@navikt/ds-react";
import UtvidetIntektTabell from "~/components/UtvidetInntektTabell";
import type { IInntektVirksomhetMaaned } from "~/types/inntekt.types";
import { formaterNorskDato, formatterNorskTall } from "~/utils/formattering.util";

interface IProps {
  inntektVirksomhetMaaned: IInntektVirksomhetMaaned;
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

export default function InntektExpansionCard({ inntektVirksomhetMaaned }: IProps) {
  console.log(inntektVirksomhetMaaned);
  return (
    <ExpansionCard aria-label="Demo med custom styling" className="mt-4">
      <ExpansionCard.Header>
        <ExpansionCard.Title>{inntektVirksomhetMaaned.virksomhetNavn} </ExpansionCard.Title>
        <ExpansionCard.Description>
          <VStack gap="4">
            <InntektInfo
              overskrift="Organisasjonsnummer"
              verdi={inntektVirksomhetMaaned.virksomhet}
            />
            <InntektInfo
              overskrift="Periode"
              verdi={`${formaterNorskDato(
                inntektVirksomhetMaaned.periode.fra
              )} - ${formaterNorskDato(inntektVirksomhetMaaned.periode.til)}`}
            />
            <InntektInfo
              overskrift="Beløp for perioden"
              verdi={formatterNorskTall(Number(inntektVirksomhetMaaned.totalBeløp))}
            />
          </VStack>
        </ExpansionCard.Description>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        <UtvidetIntektTabell inntektVirksomhetMaaned={inntektVirksomhetMaaned} />
        <Button size="small" className="mt-4">
          Legg til inntekt
        </Button>
      </ExpansionCard.Content>
    </ExpansionCard>
  );
}
