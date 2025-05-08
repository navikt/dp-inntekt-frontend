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
import { useRef } from "react";
import { InntektPerioder } from "./InntektPerioder";

import styles from "./LeggTilInntektskilde.module.css";

export default function LeggTilInntektsKilde() {
  const ref = useRef<HTMLDialogElement>(null);

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
        <Modal.Body>
          <form method="dialog" id="skjema">
            <VStack gap="4">
              <VStack gap="4" className={styles.inntektInputContainer}>
                <RadioGroup legend="Type inntektskilde" size="small">
                  <Radio value="norskVirksomhet">Norsk virksomhet</Radio>
                  <Radio value="utenlandsVirksomhet">Utenlands virksomhet</Radio>
                  <Radio value="privatPerson">Privat person</Radio>
                </RadioGroup>

                <TextField label="Arbeidsgiver" size="small" />
                <TextField label="Organisasjonsnummer" size="small" />
                <Select label="Inntektstype" size="small">
                  <option value="timelonn">Timelønn</option>
                  <option value="fastlonn">Fastlønn</option>
                  <option value="lonnEOS">Lønn EØS</option>
                  <option value="ElektroniskKom">Elektrisk kommunikasjon</option>
                </Select>
              </VStack>

              <VStack gap="2">
                <Label size="small">Periode</Label>
                <InntektPerioder />
              </VStack>
            </VStack>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button form="skjema">Lagre</Button>
          <Button type="button" variant="secondary" onClick={() => ref.current?.close()}>
            Avbryt
          </Button>
          <Button variant="tertiary">Lukk</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
