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
import { useParams } from "react-router";
import { useInntekt } from "~/context/inntekt-context";
import { useTypedRouteLoaderData } from "~/hooks/useTypedRouteLoaderData";
import type { IUklassifisertInntekt } from "~/types/inntekt.types";
import { inntektTyperBeskrivelse } from "~/utils/constants";
import { formaterNorskDato } from "~/utils/formattering.util";
import { generereFirePerioder, type IGenerertePeriode } from "~/utils/inntekt.util";
import {
  lagNyInntektskilde,
  type IFormInntekt,
  type INyInntektKilde,
} from "~/utils/ny-intekt-kilde.util";
import { hentInntektValidationSchema } from "~/validation-schema/inntekt-validation-schema";
import { InntektPerioder } from "./InntektPerioder";

import styles from "./LeggTilInntektskilde.module.css";

export default function LeggTilInntektsKilde() {
  const params = useParams();
  const inntekt = useTypedRouteLoaderData("routes/inntektId.$inntektId");
  const [genertePerioder, setGenerertePerioder] = useState<IGenerertePeriode[]>([]);
  const [manglerInntekt, setManglerInntekt] = useState(false);
  const [virksomhetsnavn, setVirksomhetsnavn] = useState<string | undefined>(undefined);
  const inntektModalRef = useRef<HTMLDialogElement>(null);
  const {
    setInntektEndret,
    klarForLagring,
    setKlarForLagring,
    contextVirsomheter,
    setContextViksomheter,
  } = useInntekt();

  const form = useForm({
    submitSource: "state",
    validationBehaviorConfig: {
      initial: "onChange",
      whenTouched: "onChange",
      whenSubmitted: "onChange",
    },
    defaultValues: {
      inntektskilde: "ORGANISASJON",
    },
    method: "post",
    schema: hentInntektValidationSchema(genertePerioder),
    action: "/inntektId/$inntektId/action",
  });

  useEffect(() => {
    const generertePerioder = generereFirePerioder(inntekt.periode);
    setGenerertePerioder(generertePerioder);
  }, []);

  useEffect(() => {
    if (klarForLagring) {
      form.submit();
      setKlarForLagring(false);
    }
  }, [klarForLagring]);

  const inntektsKilde = form.value("inntektskilde") as string;
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
    inntektModalRef.current?.close();
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

  function validate() {
    setManglerInntekt(true);
    form.validate();

    if (form.formState.isValid && minstEnInntektFyltUt) {
      setInntektEndret(true);
      setManglerInntekt(false);
      inntektModalRef.current?.close();

      // Todo: finn bedre navn
      const inntektskildeData: INyInntektKilde = {
        inntektstype: form.value("inntektstype"),
        inntektskilde: form.value("inntektskilde"),
        identifikator: form.value("identifikator"),
        identifikatorsnavn:
          inntektsKilde === "ORGANISASJON" ? virksomhetsnavn : form.value("identifikator"),
        inntekter: inntekterArray,
      };

      // Todo: finn bedre navn
      const nyInntektskilde = lagNyInntektskilde(inntektskildeData);
      const oppdatertVirksomheter = [nyInntektskilde, ...contextVirsomheter];

      // Todo: finn bedre navn
      const payload: IUklassifisertInntekt = {
        virksomheter: oppdatertVirksomheter,
        mottaker: inntekt.mottaker,
        periode: inntekt.periode,
      };

      // Sette verdier for skjulte input-felter
      form.setValue("inntektId", params.inntektId);
      form.setValue("payload", JSON.stringify(payload));

      setContextViksomheter(oppdatertVirksomheter);
    }
  }

  const identifikatorLabel =
    inntektsKilde === "ORGANISASJON" ? "Virksomhetsnummer" : "Fødselsnummer";

  return (
    <div className="mt-6">
      <Button
        variant="primary"
        icon={<PlusCircleIcon aria-hidden />}
        onClick={() => inntektModalRef.current?.showModal()}
      >
        Legg til inntektskilde
      </Button>

      <Modal
        ref={inntektModalRef}
        header={{ heading: "Inntektskilde og inntekt" }}
        width={"1150px"}
        size="small"
      >
        <form {...form.getFormProps()}>
          <Modal.Body>
            <VStack gap="4">
              <VStack gap="4" className={styles.inntektInputContainer}>
                <input type="hidden" name="identifikatorsnavn" />
                <input type="hidden" name="payload" />
                <input type="hidden" name="inntektId" />
                <RadioGroup
                  {...form.getInputProps("inntektskilde")}
                  name="inntektskilde"
                  size="small"
                  error={form.error("inntektskilde")}
                  legend="Type inntektskilde"
                >
                  <Radio value="ORGANISASJON">Norsk virksomhet</Radio>
                  <Radio value="NATURLIG_IDENT">Privat person</Radio>
                </RadioGroup>
                <TextField
                  name="identifikator"
                  label={identifikatorLabel}
                  size="small"
                  error={
                    form.error("identifikator")
                      ? `${identifikatorLabel} ${form.error("identifikator")}`
                      : undefined
                  }
                />
                {inntektsKilde === "ORGANISASJON" && virksomhetsnavn && (
                  <div>
                    <p className="bold">Virksomhet</p>
                    <p>{virksomhetsnavn}</p>
                  </div>
                )}
                <Select
                  name="inntektstype"
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
            <Button type="button" size="small" onClick={() => validate()}>
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
