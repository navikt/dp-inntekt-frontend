import { TrashIcon } from "@navikt/aksel-icons";
import { Button, ExpansionCard, HStack, VStack } from "@navikt/ds-react";
import { useEffect, useState } from "react";
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
  const {
    uklassifisertInntekt,
    setUklassifisertInntekt,
    setInntektEndret,
    slettModalRef,
    setSlettType,
    slettType,
    slettBekreftet,
    setSlettBekreftet,
  } = useInntekt();

  const erPrivatPerson = erPersonnummer(virksomhetsnummer);
  const [virksomhetsnummerSomSkalSlettes, setVirksomhetsnummerSomSkalSlettes] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    if (slettBekreftet && slettType === "VIRKSOMHET" && virksomhetsnummerSomSkalSlettes) {
      slettVirksomhet();
    }
  }, [slettBekreftet]);

  function slettVirksomhet() {
    const oppdatertVirksomheter = uklassifisertInntekt.virksomheter.filter(
      (virksomhet) => virksomhet.virksomhetsnummer !== virksomhetsnummerSomSkalSlettes
    );

    const oppdatertetInntekter = {
      ...uklassifisertInntekt,
      virksomheter: oppdatertVirksomheter,
    };

    setUklassifisertInntekt(oppdatertetInntekter);

    setInntektEndret(true);
    setSlettBekreftet(false);
    setSlettType(undefined);
    setVirksomhetsnummerSomSkalSlettes(undefined);
    slettModalRef?.current?.close();
  }

  const eksistertInntektsbeskrivelser = Array.from(
    new Set(virksomhet?.inntekter.map((i) => i.beskrivelse))
  );

  return (
    <ExpansionCard aria-label={`Inntekt for ${virksomhetsnummer}`}>
      <ExpansionCard.Header>
        <ExpansionCard.Title>
          {erPrivatPerson ? "Privatperson" : virksomhetsnavn}
        </ExpansionCard.Title>
        <ExpansionCard.Description>
          <VStack gap="4">
            <InntektInfo
              overskrift={erPrivatPerson ? "Fødselsnummer" : "Organisasjonsnummer"}
              verdi={erPrivatPerson ? maskerePersonnummer(virksomhetsnummer) : virksomhetsnummer}
            />
            <InntektInfo
              overskrift="Utbetalingsperiode"
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
          <InntektsKildeModal
            erNyVirksomhet={false}
            virksomhetsnummer={virksomhetsnummer}
            eksistertInntektsbeskrivelser={eksistertInntektsbeskrivelser}
          />
          <Button
            icon={<TrashIcon />}
            variant="tertiary"
            size="small"
            onClick={() => {
              setSlettType("VIRKSOMHET");
              setVirksomhetsnummerSomSkalSlettes(virksomhetsnummer);
              slettModalRef?.current?.showModal();
            }}
          >
            Slett inntekt
          </Button>
        </HStack>
      </ExpansionCard.Content>
    </ExpansionCard>
  );
}
