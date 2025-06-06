import { BodyLong, Modal } from "@navikt/ds-react";
import { useInntekt } from "~/context/inntekt-context";

export function GlobalModal() {
  const { globalModalRef } = useInntekt();

  return (
    <Modal
      ref={globalModalRef}
      header={{ heading: "Du har ingen endring å lagre" }}
      closeOnBackdropClick
    >
      <Modal.Body>
        <BodyLong>Du har ikke gjort noen endringer som kan lagres.</BodyLong>
      </Modal.Body>
    </Modal>
  );
}
