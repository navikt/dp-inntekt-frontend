import { TrashIcon } from "@navikt/aksel-icons";
import { Button, ExpansionCard, HStack, VStack } from "@navikt/ds-react";
import VirksomhetInntekter from "~/components/VirksomhetInntekter";
import { useInntekt } from "~/context/inntekt-context";
import type { IVirksomhet } from "~/types/inntekt.types";
import { formaterNorskDato, formatterNorskTall } from "~/utils/formattering.util";
import { erPersonnummer, maskerePersonnummer } from "~/utils/generell.util";
import InntektsKildeModal from "./LeggTilInntektsKilde/InntektsKildeModal";

interface IProps {
  virksomhet: IVirksomhet;
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

export default function Virksomhet({ virksomhet }: IProps) {
  const { virksomhetsnummer, virksomhetsnavn, periode, totalBelop } = virksomhet;
  const { uklassifisertInntekt, setUklassifisertInntekt, setInntektEndret } = useInntekt();

  const erPrivatPerson = erPersonnummer(virksomhetsnummer);

  function slettVirksomhet() {
    var oppdatertKontekstVirksomheter = uklassifisertInntekt.virksomheter.filter(
      (virksomhet) => virksomhet.virksomhetsnummer !== virksomhetsnummer
    );

    setUklassifisertInntekt({
      ...uklassifisertInntekt,
      virksomheter: oppdatertKontekstVirksomheter,
    });

    setInntektEndret(true);
  }

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
              verdi={`${formaterNorskDato(periode.fraOgMed)} - ${formaterNorskDato(
                periode.tilOgMed
              )}`}
            />
            <InntektInfo
              overskrift="Beløp for perioden"
              verdi={formatterNorskTall(Number(totalBelop))}
            />
          </VStack>
        </ExpansionCard.Description>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        <VirksomhetInntekter virksomhet={virksomhet} />
        <HStack gap="2" className="mt-8" align="baseline">
          <InntektsKildeModal erNyVirksomhet={false} virksomhetsnummer={virksomhetsnummer} />
          <Button
            icon={<TrashIcon />}
            variant="tertiary"
            size="small"
            onClick={() => slettVirksomhet()}
          >
            Slett inntekt
          </Button>
        </HStack>
      </ExpansionCard.Content>
    </ExpansionCard>
  );
}
