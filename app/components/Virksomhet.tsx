import { PlusCircleIcon, TrashIcon } from "@navikt/aksel-icons";
import { Button, ExpansionCard, HStack, VStack } from "@navikt/ds-react";
import VirksomhetInntekter from "~/components/VirksomhetInntekter";
import { useInntekt } from "~/context/inntekt-context";
import { useTypedRouteLoaderData } from "~/hooks/useTypedRouteLoaderData";
import type { IPeriode, IUklassifisertInntekt, IVirksomhet } from "~/types/inntekt.types";
import { formaterNorskDato, formatterNorskTall } from "~/utils/formattering.util";
import { erPersonnummer, maskerePersonnummer } from "~/utils/generell.util";

interface IProps {
  virksomhet: IVirksomhet;
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
        <VirksomhetInntekter virksomhet={virksomhet} inntektsPeriode={inntektsPeriode} />
        <HStack gap="2">
          <Button icon={<PlusCircleIcon />} size="small" className="mt-4">
            Legg til inntekt
          </Button>
          <Button
            icon={<TrashIcon />}
            variant="tertiary"
            size="small"
            className="mt-4"
            onClick={() => slettVirksomhet()}
          >
            Slett inntekt
          </Button>
        </HStack>
      </ExpansionCard.Content>
    </ExpansionCard>
  );
}
