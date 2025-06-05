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
import { hentVirksomhetsNavn } from "~/models/inntekt.server";

export default function LeggTilInntektsKilde() {
  const params = useParams();
  const [genertePerioder, setGenerertePerioder] = useState<IGenerertePeriode[]>([]);
  const [manglerInntekt, setManglerInntekt] = useState(false);
  const inntekt = useTypedRouteLoaderData("routes/inntektId.$inntektId");
  const [inntektskildeValg, setInntektskildeValg] = useState<string>("");
  const [virksomhetsNavn, setVirksomhetsNavn] = useState<string | undefined>(undefined);

  const ref = useRef<HTMLDialogElement>(null);
  const { setInntektEndret, klarForLagring, contextVirsomheter, setContextViksomheter } =
    useInntekt();

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
    validationBehaviorConfig: {
      initial: "onChange",
      whenTouched: "onChange",
      whenSubmitted: "onChange",
    },
    method: "post",
    schema: hentInntektValidationSchema(genertePerioder),
    action: "/inntektId/$inntektId/action",
  });

  const virksomhetsnummer = form.value("organisasjonsnummer") as string;

  useEffect(() => {
    if (virksomhetsnummer?.length === 9) {
      hentVirksomhetsNavn(virksomhetsnummer);
    }
  }, [form.value("organisasjonsnummer")]);

  function avbryt() {
    form.resetForm();
    setVirksomhetsNavn("");
    ref.current?.close();
    setManglerInntekt(false);
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
    form.validate();
    setManglerInntekt(true);

    if (form.formState.isValid && minstEnInntektFyltUt) {
      ref.current?.close();
      setInntektEndret(true);
      setManglerInntekt(false);

      // Todo: finn bedre navn
      const inntektskildeData: INyInntektKilde = {
        inntektstype: form.value("inntektstype"),
        inntektskilde: form.value("inntektskilde"),
        virksomhetsnummer: form.value("virksomhetsnummer"),
        periode: inntekt.periode,
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
                <input type="hidden" name="payload" />
                <input type="hidden" name="inntektId" />
                <TextField
                  name="virksomhetsnummer"
                  label="Virksomhetsnummer"
                  size="small"
                  error={form.error("virksomhetsnummer")}
                />

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
