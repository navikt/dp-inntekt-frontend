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

import styles from "./LeggTilInntektskilde.module.css";

export default function LeggTilInntektsKilde() {
  const { setInntektEndret, klarForLagring } = useInntekt();
  const [genertePerioder, setGenerertePerioder] = useState<IGenerertePeriode[]>([]);
  const inntekt = useTypedRouteLoaderData("routes/inntektId.$inntektId");
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

  function avbryt() {
    form.resetForm();
    ref.current?.close();
  }

  function validate() {
    form.validate();

    if (form.formState.isValid && form.formState.isTouched) {
      ref.current?.close();
      setInntektEndret(true);
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
                >
                  <Radio value="ORGANISASJON">Norsk virksomhet</Radio>
                  <Radio value="NATURLIG_IDENT">Privat person</Radio>
                </RadioGroup>
                <TextField
                  name="organisasjonsnavn"
                  label="Organisasjonsnavn"
                  size="small"
                  error={form.error("organisasjonsnavn")}
                />
                <input type="hidden" name="originalData" />
                <input type="hidden" name="inntektId" />
                <TextField
                  name="organisasjonsnummer"
                  label="Organisasjonsnummer"
                  size="small"
                  error={form.error("organisasjonsnummer")}
                />
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
