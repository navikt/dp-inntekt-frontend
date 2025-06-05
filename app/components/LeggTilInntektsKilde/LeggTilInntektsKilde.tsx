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
import { useTypedRouteLoaderData } from "~/hooks/useTypedRouteLoaderData";
import { generereFirePerioder, type IGenerertePeriode } from "~/utils/inntekt.util";
import { hentInntektValidationSchema } from "~/validation-schema/inntekt-validation-schema";
import { InntektPerioder } from "./InntektPerioder";
import { inntektTyperBeskrivelse } from "~/utils/constants";
import { useInntekt } from "~/context/inntekt-context";
import { formaterNorskDato } from "~/utils/formattering.util";

import styles from "./LeggTilInntektskilde.module.css";

export default function LeggTilInntektsKilde() {
  const { setInntektEndret, klarForLagring } = useInntekt();
  const [genertePerioder, setGenerertePerioder] = useState<IGenerertePeriode[]>([]);
  const inntekt = useTypedRouteLoaderData("routes/inntektId.$inntektId");
  const [inntektskildeValg, setInntektskildeValg] = useState<string>("");
  const [virksomhetsNavn, setVirksomhetsNavn] = useState<string | undefined>(undefined);

  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const generertePerioder = generereFirePerioder(inntekt.periode);
    setGenerertePerioder(generertePerioder);
  }, []);

  useEffect(() => {
    if (klarForLagring) {
      form.submit();
    }
  }, [klarForLagring]);

  const form = useForm({
    submitSource: "state",
    method: "post",
    schema: hentInntektValidationSchema(genertePerioder),
    action: "/inntektId/$inntektId/action",
    defaultValues: {
      originalData: JSON.stringify({
        virksomheter: inntekt.virksomheter,
        mottaker: inntekt.mottaker,
        periode: inntekt.periode,
      }),
      inntektId: inntekt.inntektId,
    },
  });
  const virksomhetsnummer = form.value("organisasjonsnummer") as string

  useEffect(() => {
    if (virksomhetsnummer?.length === 9) {
      hentVirksomhetsNavn();
    }
  }, [form.value("organisasjonsnummer")]);

  function avbryt() {
    form.resetForm();
    setVirksomhetsNavn("");
    ref.current?.close();
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

  function validate() {
    // Hvis skjemaet ikke er berørt, validerer vi det for å vise feil
    if (!form.formState.isTouched) {
      form.validate();
      return;
    }

    if (form.formState.isValid && minstEnInntektFyltUt) {
      ref.current?.close();
      setInntektEndret(true);
      setVirksomhetsNavn("");
      return;
    }
  }

  async function hentVirksomhetsNavn() {
    const response = await fetch(`/api/enhetsregister/${virksomhetsnummer}`, {
      method: "GET",
    });

    if (response.ok) {
      const organisasjon = await response.json();
      setVirksomhetsNavn(organisasjon.navn);
    }
  }


  const visManglerInntektError =
    form.formState.isTouched && form.formState.isValid && !minstEnInntektFyltUt;

  return (
    <div className="mt-6">
      <Button
        variant="primary"
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
                  name="inntektskilde"
                  legend="Type inntektskilde"
                  size="small"
                  error={form.error("inntektskilde")}
                  onChange={(valgtKilde) => setInntektskildeValg(valgtKilde)}
                >
                  <Radio value="ORGANISASJON">Norsk virksomhet</Radio>
                  <Radio value="NATURLIG_IDENT">Privat person</Radio>
                </RadioGroup>

                {inntektskildeValg === "ORGANISASJON" && (
                  <>
                    <TextField
                      name="organisasjonsnummer"
                      label="Virksomhetsnummer"
                      size="small"
                      error={form.error("organisasjonsnummer")}
                    />

                    {virksomhetsNavn && <p>{virksomhetsNavn}</p>}
                  </>
                )}
                {inntektskildeValg === "NATURLIG_IDENT" && (
                  <TextField
                    name="fodselsnummer"
                    label="Fødselsnummer"
                    size="small"
                    error={form.error("fodselsnummer")}
                  />
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
                {visManglerInntektError && (
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
