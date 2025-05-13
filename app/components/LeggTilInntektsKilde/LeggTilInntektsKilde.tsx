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
import { useRef, useState } from "react";
import { z } from "zod";
import { InntektPerioder } from "./InntektPerioder";

import styles from "./LeggTilInntektskilde.module.css";

const schema = z.object({
  inntektskilde: z.string({
    required_error: "Inntektskilde er påkrevd",
  }),
  organisasjonsnavn: z
    .string({
      required_error: "Organisasjonsnavn er påkrevd",
    })
    .min(1, "Organisasjonsnavn er påkrevd")
    .max(50, "Organisasjonsnavn er for langt"),
  organisasjonsnummer: z
    .string({
      required_error: "Organisasjonsnummer er påkrevd",
    })
    .min(1, "Organisasjonsnummer er påkrevd")
    .max(50, "Organisasjonsnummer er for langt"),
  inntektstype: z.string({
    required_error: "Inntektstype er påkrevd",
  }),
});

export default function LeggTilInntektsKilde() {
  const ref = useRef<HTMLDialogElement>(null);

  const inntektForm = useForm({
    submitSource: "state",
    method: "put",
    schema,
  });

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
        width={"1024px"}
        size="small"
      >
        <form {...inntektForm.getFormProps()}>
          <Modal.Body>
            <VStack gap="4">
              <VStack gap="4" className={styles.inntektInputContainer}>
                <RadioGroup
                  name="inntektskilde"
                  legend="Type inntektskilde"
                  size="small"
                  error={inntektForm.error("inntektskilde")}
                >
                  <Radio value="norskVirksomhet">Norsk virksomhet</Radio>
                  <Radio value="privatPerson">Privat person</Radio>
                </RadioGroup>
                <TextField
                  name="organisasjonsnavn"
                  label="Organisasjonsnavn"
                  size="small"
                  error={inntektForm.error("organisasjonsnavn")}
                />
                <TextField
                  name="organisasjonsnummer"
                  label="Organisasjonsnummer"
                  size="small"
                  error={inntektForm.error("organisasjonsnummer")}
                />
                <Select
                  name="inntektstype"
                  label="Inntektstype"
                  size="small"
                  error={inntektForm.error("inntektstype")}
                >
                  <option value="">Velg inntekstype</option>
                  <option value="timelonn">Timelønn</option>
                  <option value="fastlonn">Fastlønn</option>
                  <option value="ElektroniskKom">Elektrisk kommunikasjon</option>
                </Select>
              </VStack>
              <VStack gap="2">
                <Label size="small">Periode</Label>
                <InntektPerioder />
              </VStack>
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit">Lagre</Button>
            <Button type="button" variant="secondary" onClick={() => ref.current?.close()}>
              Avbryt
            </Button>
            <Button variant="tertiary">Lukk</Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}
