import { BodyLong, Button, Modal } from "@navikt/ds-react";
import { useInntekt } from "~/context/inntekt-context";

export function SlettModal() {
  const { slettModalRef, setSlettBekreftet } = useInntekt();

  return (
    <Modal
      ref={slettModalRef}
      header={{
        heading: "Du er i ferd med å slette denne inntekten",
      }}
      width="medium"
    >
      <Modal.Body>
        <BodyLong>Er du sikker på at du vil slette denne inntekten fra inntektskilden?</BodyLong>
      </Modal.Body>

      <Modal.Footer>
        <Button
          type="button"
          onClick={() => setSlettBekreftet(true)}
          variant="primary"
          size="small"
        >
          Bekreft
        </Button>
        <Button
          type="button"
          variant="tertiary"
          onClick={() => slettModalRef?.current?.close()}
          size="small"
        >
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
