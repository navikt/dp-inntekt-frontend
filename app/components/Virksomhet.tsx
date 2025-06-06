import {PlusCircleIcon, TrashIcon} from "@navikt/aksel-icons";
import {Button, ExpansionCard, VStack} from "@navikt/ds-react";
import VirsomhetInntekter from "~/components/VirsomhetInntekter";
import type { IPeriode, IVirksomhet } from "~/types/inntekt.types";
import { formaterNorskDato, formatterNorskTall } from "~/utils/formattering.util";
import { erPersonnummer, maskerePersonnummer } from "~/utils/generell.util";

interface IProps {
    virksomhet: IVirksomhet,
    inntektsPeriode: IPeriode,
    slettVirksomhet: (virksomhetsnummer: string) => void
}

interface IInntekInfo {
    overskrift: string;
    verdi: string;
}

export function InntektInfo({overskrift, verdi}: IInntekInfo) {
    return (
        <VStack gap="0">
            <strong>{overskrift}</strong>
            <p>{verdi}</p>
        </VStack>
    );
}

export default function Virksomhet({virksomhet, inntektsPeriode, slettVirksomhet}: IProps) {
    const {virksomhetsnummer, virksomhetsnavn, periode, totalBelop} = virksomhet;

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
                <VirsomhetInntekter virksomhet={virksomhet} inntektsPeriode={inntektsPeriode}/>
                <Button icon={<PlusCircleIcon/>} size="small" className="mt-4">
                    Legg til inntekt
                </Button>
                <Button icon={<TrashIcon/>} variant="tertiary" size="small" className="mt-4" onClick={() => slettVirksomhet(virksomhetsnummer)}>
                    Slett inntekt
                </Button>
            </ExpansionCard.Content>
        </ExpansionCard>
    );
}
