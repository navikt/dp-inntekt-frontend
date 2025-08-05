import { PlusCircleIcon } from "@navikt/aksel-icons";
import {
  Button,
  Label,
  Modal,
  Radio,
  RadioGroup,
  Select,
  TextField,
  VStack,
} from "@navikt/ds-react";
import { useForm } from "@rvf/react-router";
import { useEffect, useRef, useState } from "react";
import { useInntekt } from "~/context/inntekt-context";
import { useTypedRouteLoaderData } from "~/hooks/useTypedRouteLoaderData";
import type { IVirksomhet } from "~/types/inntekt.types";
import { INNTEKTSBESKRIVELSER } from "~/utils/constants";
import { formaterNorskDato } from "~/utils/formattering.util";
import { erPersonnummer } from "~/utils/generell.util";
import { generereFirePerioder, type IGenerertePeriode } from "~/utils/inntekt.util";
import {
  finnTidligsteOgSenesteDato,
  finnTotalBelop,
  type IFormInntekt,
  lagInntektListe,
} from "~/utils/ny-inntekt-kilde.util";
import { hentInntektValidationSchema } from "~/validation-schema/inntekt-validation-schema";
import { InntektPerioder } from "./InntektPerioder";

import styles from "./InntektsKildeModal.module.css";
import {idnr} from "@navikt/fnrvalidator";

interface IProps {
  erNyVirksomhet: boolean;
  virksomhetsnummer: string | undefined;
  eksistertInntektsbeskrivelser?: string[];
}

export default function InntektsKildeModal({
  erNyVirksomhet,
  virksomhetsnummer,
  eksistertInntektsbeskrivelser,
}: IProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const inntekt = useTypedRouteLoaderData("routes/inntektId.$inntektId");
  const [genertePerioder, setGenerertePerioder] = useState<IGenerertePeriode[]>([]);
  const [manglerInntekt, setManglerInntekt] = useState(false);
  const [virksomhetsnavn, setVirksomhetsnavn] = useState<string | undefined>(
    erNyVirksomhet ? undefined : virksomhetsnummer
  );
  const { setInntektEndret, uklassifisertInntekt, setUklassifisertInntekt } = useInntekt();
  const [duplikatIdentifikator, setDuplikatIdentifikator] = useState(false);
  const [invalidIdentificator, setInvalidIdentificator] = useState(false);

  // Dette er en workaround for å fikse en feil vi ikke forstår helt
  // Hvordan gjenskaper man denne feilen?
  // Legg inn en ny inntektskilder som privat person
  // Label på identifikator endres til "Fødselsnummer"
  // Fyll ut inntekstype og inntekter og trykk "Sett inn"
  // Legg til en ny inntektskilde som privat person en gang til
  // Label på identifikator blir fortsatt "Organisasjonsnummer"
  const [showForms, setShowForms] = useState(false);

  const form = useForm({
    submitSource: "state",
    validationBehaviorConfig: {
      initial: "onChange",
      whenTouched: "onChange",
      whenSubmitted: "onChange",
    },
    defaultValues: hentDefaultValues(),
    method: "post",
    schema: hentInntektValidationSchema(genertePerioder),
    action: "/inntektId/$inntektId/action",
  });

  function hentDefaultValues() {
    if (erNyVirksomhet || !virksomhetsnummer) {
      return {
        inntektskilde: undefined,
        identifikator: undefined,
      };
    }

    return {
      inntektskilde: erPersonnummer(virksomhetsnummer) ? "NATURLIG_IDENT" : "ORGANISASJON",
      identifikator: virksomhetsnummer,
    };
  }

  useEffect(() => {
    const generertePerioder = generereFirePerioder(inntekt.periode);
    setGenerertePerioder(generertePerioder);
  }, []);

  const inntektskilde = form.value("inntektskilde") as string;
  const identifikator = form.value("identifikator") as string;

  useEffect(() => {
    if (identifikator?.length === 11 && inntektskilde === "NATURLIG_IDENT") {
      const validerIdNr = idnr(identifikator);
      if(validerIdNr.status !== "valid") {
        setVirksomhetsnavn(undefined);
        setInvalidIdentificator(true);
        form.error("identifikator");
      } else {
        setInvalidIdentificator(false)
      }
    }

    if (identifikator?.length === 9 && inntektskilde === "ORGANISASJON") {
      hentVirksomhetsNavn();
    }

    const identifikatorListe = uklassifisertInntekt.virksomheter.map(
      (virksomhet) => virksomhet.virksomhetsnummer
    );

    setDuplikatIdentifikator(identifikatorListe.includes(identifikator));
  }, [identifikator]);

  async function hentVirksomhetsNavn() {
    const response = await fetch(`/api/enhetsregister/${identifikator}`, {
      method: "GET",
    });

    if (response.ok) {
      const organisasjon = await response.json();
      setVirksomhetsnavn(organisasjon.navn);
    }
  }

  function avbryt() {
    setManglerInntekt(false);
    setVirksomhetsnavn(undefined);

    form.resetForm();
    ref?.current?.close();
  }

  // Henter ut alle aktive inntekts måneder som ikke er readOnly
  const aktiveInntektsManeder = genertePerioder
    .flatMap((year) => year.maneder)
    .filter((maaned) => !maaned.readOnly)
    .map((maaned) => maaned.dato);

  // Sjekker om minst en inntekt er fylt ut
  const minstEnInntektFyltUt = aktiveInntektsManeder.some(
    (felt) => form.value(felt) && form.value(felt) !== ""
  );

  // Liste over inntekter som er fylt ut i form
  const inntekterArray: IFormInntekt[] = aktiveInntektsManeder
    .filter((input) => form.value(input) !== undefined && form.value(input) !== "")
    .map((input) => ({ dato: input, belop: form.value(input) }));

  async function settInnNyInntekt() {
    const validering = await form.validate();
    const harFeil = Object.keys(validering).length > 0;

    if (harFeil) {
      return;
    }

    if (!harFeil && !minstEnInntektFyltUt) {
      setManglerInntekt(true);
      return;
    }

    if (!harFeil && minstEnInntektFyltUt) {
      setInntektEndret(true);
      setManglerInntekt(false);
      ref?.current?.close();

      const beskrivelse = form.value("beskrivelse");
      const inntektskilde = form.value("inntektskilde");
      const identifikator = form.value("identifikator");

      const virksomhet: IVirksomhet = uklassifisertInntekt.virksomheter.find(
        (virksomhet) => virksomhet.virksomhetsnummer === identifikator
      )!!;

      const nyeInntekter = lagInntektListe(
        beskrivelse,
        inntektskilde,
        identifikator,
        inntekterArray
      );

      // Oppdaterer eksisterende virksomhet med nye inntekter
      // Flatter inntektene slik at vi kan legge til flere inntekter for individuelle
      const oppdaterteInntekter = [...virksomhet.inntekter, nyeInntekter].flat();

      const oppdatertVirksomhet: IVirksomhet = {
        ...virksomhet,
        periode: finnTidligsteOgSenesteDato(oppdaterteInntekter),
        inntekter: oppdaterteInntekter,
        totalBelop: finnTotalBelop(oppdaterteInntekter),
      };

      setUklassifisertInntekt({
        ...uklassifisertInntekt,
        virksomheter: uklassifisertInntekt.virksomheter.map((virksomhet) =>
          virksomhet.virksomhetsnummer === oppdatertVirksomhet.virksomhetsnummer
            ? oppdatertVirksomhet
            : virksomhet
        ),
      });

      form.resetForm();
      setShowForms(false);
    }
  }

  async function settInnNyInntektKilde() {
    const validering = await form.validate();
    const harFeil = Object.keys(validering).length > 0;

    if (harFeil) {
      return;
    }

    if (!harFeil && !minstEnInntektFyltUt) {
      setManglerInntekt(true);
      return;
    }

    if (!harFeil && minstEnInntektFyltUt  && !duplikatIdentifikator && !invalidIdentificator) {
      setInntektEndret(true);
      setManglerInntekt(false);

      const beskrivelse = form.value("beskrivelse");
      const inntektskilde = form.value("inntektskilde");
      const identifikator = form.value("identifikator");
      const inntekter = lagInntektListe(beskrivelse, inntektskilde, identifikator, inntekterArray);

      const nyVirksomhet: IVirksomhet = {
        avvikListe: [],
        inntekter: inntekter,
        virksomhetsnavn: virksomhetsnavn ?? identifikator,
        virksomhetsnummer: identifikator,
        totalBelop: finnTotalBelop(inntekter),
        periode: finnTidligsteOgSenesteDato(inntekter),
      };

      const oppdaterteVirksomheter = [nyVirksomhet, ...uklassifisertInntekt.virksomheter];

      setUklassifisertInntekt({
        ...uklassifisertInntekt,
        virksomheter: oppdaterteVirksomheter,
      });

      ref?.current?.close();
      form.resetForm();
      setShowForms(false);
    }
  }

  const identifikatorLabel =
    inntektskilde === "NATURLIG_IDENT" ? "Fødselsnummer" : "Organisasjonsnummer";

  function hentIdentifikatorFeilmelding() {
    if (form.error("identifikator")) {
      return `${identifikatorLabel} ${form.error("identifikator")}`;
    }

    if (duplikatIdentifikator) {
      return `${identifikatorLabel} er allerede lagt til`;
    }

    if( invalidIdentificator) {
      return `Ugyldig fødselsnummer`;
    }

    return undefined;
  }

  return (
    <div>
      <Button
        variant="primary"
        size={erNyVirksomhet ? "medium" : "small"}
        icon={<PlusCircleIcon aria-hidden />}
        onClick={() => {
          ref.current?.showModal();
          setShowForms(true);
        }}
      >
        {erNyVirksomhet ? "Legg til inntektskilde" : "Legg til inntekt"}
      </Button>

      <Modal
        ref={ref}
        header={{ heading: "Inntektskilde og inntekt" }}
        width={"1150px"}
        size="small"
      >
        {showForms && (
          <form {...form.getFormProps()}>
            <Modal.Body>
              <VStack gap="4">
                <VStack gap="4" className={styles.inntektInputContainer}>
                  <RadioGroup
                    {...form.getInputProps("inntektskilde")}
                    size="small"
                    error={form.error("inntektskilde")}
                    legend="Type inntektskilde"
                    disabled={!erNyVirksomhet}
                  >
                    <Radio value="ORGANISASJON">Norsk virksomhet</Radio>
                    <Radio value="NATURLIG_IDENT">Privatperson</Radio>
                  </RadioGroup>
                  <TextField
                    {...form.getInputProps("identifikator")}
                    label={identifikatorLabel}
                    size="small"
                    disabled={!erNyVirksomhet}
                    error={hentIdentifikatorFeilmelding()}
                  />
                  {inntektskilde === "ORGANISASJON" && virksomhetsnavn && (
                    <div>
                      <p className="bold">Virksomhet</p>
                      <p>{virksomhetsnavn}</p>
                    </div>
                  )}
                  <Select
                    {...form.getInputProps("beskrivelse")}
                    label="Inntektstype"
                    size="small"
                    error={form.error("beskrivelse")}
                  >
                    <option value="">Velg inntekstype</option>
                    {INNTEKTSBESKRIVELSER.map((beskrivelse) => (
                      <option
                        value={beskrivelse.key}
                        key={beskrivelse.key}
                        disabled={
                          !!eksistertInntektsbeskrivelser?.length &&
                          eksistertInntektsbeskrivelser.includes(beskrivelse.key)
                        }
                      >
                        {beskrivelse.text}
                      </option>
                    ))}
                  </Select>
                </VStack>
                <VStack gap="2">
                  <Label size="small">Utbetalingsperiode</Label>
                  <InntektPerioder perioder={genertePerioder} form={form} />
                  <div className={styles.errorSummary}>
                    {aktiveInntektsManeder.map(
                      (felt) =>
                        form.error(felt) && (
                          <div className="mt-2" key={felt}>
                            Inntekt for {formaterNorskDato(felt)} er {form.error(felt)}
                          </div>
                        )
                    )}
                  </div>
                  {manglerInntekt && !minstEnInntektFyltUt && (
                    <div className={styles.errorSummary}>
                      Du må legge til inntekt for minst én måned
                    </div>
                  )}
                </VStack>
              </VStack>
            </Modal.Body>
            <Modal.Footer>
              <Button
                type="button"
                size="small"
                onClick={() => (erNyVirksomhet ? settInnNyInntektKilde() : settInnNyInntekt())}
              >
                Sett inn
              </Button>
              <Button type="button" size="small" variant="secondary" onClick={() => avbryt()}>
                Avbryt
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Modal>
    </div>
  );
}
