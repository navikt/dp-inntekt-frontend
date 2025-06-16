import { BodyLong, Button, Modal } from "@navikt/ds-react";
import { useInntekt } from "~/context/inntekt-context";
import { useTypedRouteLoaderData } from "~/hooks/useTypedRouteLoaderData";

export function GlobalModal() {
  const { globalModalRef, inntektEndret, setUklassifisertInntekt, setInntektEndret } = useInntekt();
  const loaderData = useTypedRouteLoaderData("routes/inntektId.$inntektId");

  const modalHeader = inntektEndret
    ? "Du er i ferd med å nullstille endringene"
    : "Du har ingen endring å lagre";

  const modalDescription = inntektEndret
    ? "Er du sikker på at du vil nullstille endringene?"
    : "Du har ikke gjort noen endringer som kan lagres.";
  return (
    <Modal
      ref={globalModalRef}
      header={{
        heading: modalHeader,
      }}
      width="medium"
    >
      <Modal.Body>
        <BodyLong>{modalDescription}</BodyLong>
      </Modal.Body>

      {inntektEndret && (
        <Modal.Footer>
          <Button
            type="button"
            onClick={() => {
              setUklassifisertInntekt(loaderData);
              setInntektEndret(false);
              globalModalRef?.current?.close();
            }}
            variant="primary"
            size="small"
          >
            Bekreft
          </Button>
          <Button
            type="button"
            variant="tertiary"
            onClick={() => globalModalRef?.current?.close()}
            size="small"
          >
            Avbryt
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
}
