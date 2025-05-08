import { Button, ExpansionCard, VStack } from "@navikt/ds-react";
import UtvidetIntektTabell from "~/components/UtvidetInntektTabell";
import type { IInntektVirksomhetMaaned } from "~/types/inntekt.types";
import { formaterNorskDato, formatterNorskTall } from "~/utils/formattering.util";
import { summerInntekter } from "~/utils/inntekt.util";

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

export default function InntektsKilde({ inntektVirksomhetMaaned }: IProps) {
  return (
    <ExpansionCard aria-label="Demo med custom styling">
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
              // Todo: Bruk tallet fra backend isteden
              verdi={formatterNorskTall(summerInntekter(inntektVirksomhetMaaned.inntekter))}
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
