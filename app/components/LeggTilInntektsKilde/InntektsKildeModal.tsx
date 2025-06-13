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
import { inntektTyperBeskrivelse } from "~/utils/constants";
import { formaterNorskDato } from "~/utils/formattering.util";
import { generereFirePerioder, type IGenerertePeriode } from "~/utils/inntekt.util";
import {
  finnTidligsteOgSenesteDato,
  finnTotalBelop,
  lagInntektListe,
  type IFormInntekt,
} from "~/utils/ny-intekt-kilde.util";
import { hentInntektValidationSchema } from "~/validation-schema/inntekt-validation-schema";
import { InntektPerioder } from "./InntektPerioder";
import type { IVirksomhet } from "~/types/inntekt.types";
import { PlusCircleIcon } from "@navikt/aksel-icons";

import styles from "./InntektsKildeModal.module.css";

export default function InntektsKildeModal() {
  const ref = useRef<HTMLDialogElement>(null);
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
  });

  useEffect(() => {
    const generertePerioder = generereFirePerioder(inntekt.periode);
    setGenerertePerioder(generertePerioder);
  }, []);

  const inntektskilde = form.value("inntektskilde") as string;
  const identifikator = form.value("identifikator") as string;

  useEffect(() => {
    if (identifikator?.length === 9) {
      hentVirksomhetsNavn();
    } else {
      setVirksomhetsnavn(undefined);
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

      const inntektstype = form.value("inntektstype");
      const inntektskilde = form.value("inntektskilde");
      const identifikator = form.value("identifikator");

      const nyVirksomhet: IVirksomhet = {
        virksomhetsnummer: identifikator,
        virksomhetsnavn: inntektskilde === "ORGANISASJON" ? virksomhetsnavn : identifikator,
        periode: finnTidligsteOgSenesteDato(inntekterArray),
        inntekter: lagInntektListe(inntektstype, inntektskilde, identifikator, inntekterArray),
        totalBelop: finnTotalBelop(inntekterArray),
        avvikListe: [],
      };

      const oppdaterteVirksomheter = [nyVirksomhet, ...uklassifisertInntekt.virksomheter];

      setUklassifisertInntekt({
        ...uklassifisertInntekt,
        virksomheter: oppdaterteVirksomheter,
      });

      form.resetForm();
    }
  }

  const identifikatorLabel =
    inntektskilde === "NATURLIG_IDENT" ? "Fødselsnummer" : "Virksomhetsnummer";

  return (
    <div className="mt-6">
      <Button
        variant="primary"
        className="mt-6"
        icon={<PlusCircleIcon aria-hidden />}
        onClick={() => ref.current?.showModal()}
      >
        Legg til inntektskilde
      </Button>

      <Modal
        ref={ref}
        header={{ heading: "Inntektskilde og inntekt" }}
        width={"1150px"}
        size="small"
      >
        <form {...form.getFormProps()}>
          <Modal.Body>
            <VStack gap="4">
              <VStack gap="4" className={styles.inntektInputContainer}>
                <RadioGroup
                  {...form.getInputProps("inntektskilde")}
                  size="small"
                  error={form.error("inntektskilde")}
                  legend="Type inntektskilde"
                >
                  <Radio value="ORGANISASJON">Norsk virksomhet</Radio>
                  <Radio value="NATURLIG_IDENT">Privat person</Radio>
                </RadioGroup>
                <TextField
                  {...form.getInputProps("identifikator")}
                  label={identifikatorLabel}
                  size="small"
                  error={
                    form.error("identifikator")
                      ? `${identifikatorLabel} ${form.error("identifikator")}`
                      : undefined
                  }
                />
                {inntektskilde === "ORGANISASJON" && virksomhetsnavn && (
                  <div>
                    <p className="bold">Virksomhet</p>
                    <p>{virksomhetsnavn}</p>
                  </div>
                )}
                <Select
                  {...form.getInputProps("inntektstype")}
                  label="Inntektstype"
                  size="small"
                  error={form.error("inntektstype")}
                >
                  <option value="">Velg inntekstype</option>
                  {inntektTyperBeskrivelse.map((inntektType) => (
                    <option value={inntektType.key} key={inntektType.key}>
                      {inntektType.text}
                    </option>
                  ))}
                </Select>
              </VStack>
              <VStack gap="2">
                <Label size="small">Periode</Label>
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
