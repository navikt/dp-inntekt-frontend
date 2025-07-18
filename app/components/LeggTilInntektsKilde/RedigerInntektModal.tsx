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
import { useEffect, useState } from "react";
import { useInntekt } from "~/context/inntekt-context";
import { useTypedRouteLoaderData } from "~/hooks/useTypedRouteLoaderData";
import type { IInntekt, IVirksomhet } from "~/types/inntekt.types";
import { INNTEKTSBESKRIVELSER } from "~/utils/constants";
import { formaterNorskDato } from "~/utils/formattering.util";
import { erPersonnummer } from "~/utils/generell.util";
import { generereFirePerioder, type IGenerertePeriode } from "~/utils/inntekt.util";
import {
  finnTidligsteOgSenesteDato,
  finnTotalBelop,
  lagInntektListe,
  type IFormInntekt,
} from "~/utils/ny-inntekt-kilde.util";
import { hentInntektValidationSchema } from "~/validation-schema/inntekt-validation-schema";
import { InntektPerioder } from "./InntektPerioder";

import styles from "./InntektsKildeModal.module.css";

interface IProps {
  ref: React.RefObject<HTMLDialogElement | null>;
  virksomhet: IVirksomhet;
  formDefaultValues: {
    beskrivelse: string;
    inntektskilde: string;
    inntekter: IInntekt[];
  };
}

export default function RedigerModal({ ref, virksomhet, formDefaultValues }: IProps) {
  const inntekt = useTypedRouteLoaderData("routes/inntektId.$inntektId");
  const [genertePerioder, setGenerertePerioder] = useState<IGenerertePeriode[]>([]);
  const [manglerInntekt, setManglerInntekt] = useState(false);
  const [virksomhetsnavn, setVirksomhetsnavn] = useState<string | undefined>(undefined);
  const { setInntektEndret, uklassifisertInntekt, setUklassifisertInntekt } = useInntekt();

  const form = useForm({
    submitSource: "state",
    validationBehaviorConfig: {
      initial: "onChange",
      whenTouched: "onChange",
      whenSubmitted: "onChange",
    },
    method: "post",
    schema: hentInntektValidationSchema(genertePerioder),
    action: "/inntektId/$inntektId/action",
    defaultValues: hentDefaultValues(),
  });

  function hentDefaultValues() {
    return {
      inntektskilde: formDefaultValues.inntektskilde,
      beskrivelse: formDefaultValues.beskrivelse,
      identifikator: virksomhet.virksomhetsnummer,
      // Sette default verdi for inntekt basert på formDefaultValues?.inntekter
      // med dette format 2021-11 : 10000
      ...formDefaultValues.inntekter?.reduce((acc, inntekt) => {
        acc[inntekt.aarMaaned] = parseInt(inntekt.belop, 10).toString();
        return acc;
      }, {} as Record<string, string>),
    };
  }

  useEffect(() => {
    const generertePerioder = generereFirePerioder(inntekt.periode);
    setGenerertePerioder(generertePerioder);
  }, []);

  const inntektsKilde = form.value("inntektskilde") as string;
  const identifikator = form.value("identifikator") as string;

  useEffect(() => {
    if (erPersonnummer(identifikator)) {
      setVirksomhetsnavn(undefined);
    } else {
      hentVirksomhetsNavn();
    }
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
    ref?.current?.close();
    form.resetForm();
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
    .filter((felt) => form.value(felt) !== undefined && form.value(felt) !== "")
    .map((felt) => ({ dato: felt, belop: form.value(felt) }));

  async function settInn() {
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

      const oppdatertInntektListe = lagInntektListe(
        formDefaultValues.beskrivelse,
        formDefaultValues.inntektskilde,
        virksomhet.virksomhetsnummer,
        inntekterArray
      );

      const inntekter = [
        ...virksomhet.inntekter.filter((i) => i.beskrivelse !== formDefaultValues.beskrivelse),
        ...oppdatertInntektListe,
      ];

      const oppdatertVirksomhet: IVirksomhet = {
        ...virksomhet,
        inntekter: inntekter,
        periode: finnTidligsteOgSenesteDato(inntekter),
        totalBelop: finnTotalBelop(inntekter),
      };

      const oppdaterteVirksomheter = uklassifisertInntekt.virksomheter.map((virksomhet) =>
        virksomhet.virksomhetsnummer === identifikator ? oppdatertVirksomhet : virksomhet
      );

      setUklassifisertInntekt({
        ...uklassifisertInntekt,
        virksomheter: oppdaterteVirksomheter,
      });
    }
  }

  const identifikatorLabel =
    inntektsKilde === "NATURLIG_IDENT" ? "Fødselsnummer" : "Organisasjonsnummer";

  const inntekstTypeTekst =
    INNTEKTSBESKRIVELSER.find((type) => type.key === form.value("beskrivelse"))?.text || "";

  return (
    <div className="mt-6">
      <Modal
        ref={ref}
        header={{ heading: "Inntektskilde og inntekt" }}
        width={"1150px"}
        size="small"
        className={styles.redigeringsModal}
      >
        <form {...form.getFormProps()}>
          <Modal.Body>
            <VStack gap="4">
              <VStack gap="4" className={styles.inntektInputContainer}>
                <RadioGroup
                  {...form.getInputProps("inntektskilde")}
                  size="small"
                  legend="Type inntektskilde"
                  readOnly
                >
                  <Radio value="ORGANISASJON">Norsk virksomhet</Radio>
                  <Radio value="NATURLIG_IDENT">Privatperson</Radio>
                </RadioGroup>
                <TextField
                  {...form.getInputProps("identifikator")}
                  label={identifikatorLabel}
                  size="small"
                  readOnly
                />
                {inntektsKilde === "ORGANISASJON" && virksomhetsnavn && (
                  <div>
                    <p className="bold">Virksomhet</p>
                    <p>{virksomhetsnavn}</p>
                  </div>
                )}
                <TextField label="Inntektstype" value={inntekstTypeTekst} size="small" readOnly />
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
            <Button type="button" size="small" onClick={() => settInn()}>
              Sett inn
            </Button>
            <Button type="button" size="small" variant="secondary" onClick={() => avbryt()}>
              Avbryt
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}
