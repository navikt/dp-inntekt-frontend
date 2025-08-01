import { BodyLong, Button, Modal } from "@navikt/ds-react";
import { useInntekt } from "~/context/inntekt-context";
import { useTypedRouteLoaderData } from "~/hooks/useTypedRouteLoaderData";

export function GlobalModal() {
  const loaderData = useTypedRouteLoaderData("routes/inntektId.$inntektId");
  const { globalModalRef, inntektEndret, setUklassifisertInntekt, setInntektEndret } = useInntekt();

  return (
    <Modal
      ref={globalModalRef}
      header={{
        heading: "Du har ingen endring å lagre",
      }}
      width="medium"
    >
      <Modal.Body>
        <BodyLong>Du har ikke gjort noen endringer som kan lagres.</BodyLong>
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
