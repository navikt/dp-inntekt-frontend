import { ArrowCirclepathIcon, FloppydiskIcon } from "@navikt/aksel-icons";
import {
  BodyShort,
  Box,
  Button,
  CopyButton,
  HStack,
  Modal,
  Spacer,
  Textarea,
} from "@navikt/ds-react";
import { useForm } from "@rvf/react-router";
import { useEffect, useRef } from "react";
import { useNavigation, useParams } from "react-router";
import { useInntekt } from "~/context/inntekt-context";
import { erEnKvinne } from "~/utils/generell.util";
import { lagreEndringerSchema } from "~/validation-schema/lagre-endringer-schema";
import { KvinneIkon } from "./Ikoner/KvinneIkon";
import { MennIkon } from "./Ikoner/MennIkon";
import { useTypedRouteLoaderData } from "~/hooks/useTypedRouteLoaderData";

export function Personalia() {
  const params = useParams();
  const loaderData = useTypedRouteLoaderData("routes/inntektId.$inntektId");
  const { state } = useNavigation();
  const {
    inntektEndret,
    globalModalRef,
    uklassifisertInntekt,
    setInntektEndret,
    setUklassifisertInntekt,
  } = useInntekt();
  const ref = useRef<HTMLDialogElement>(null);

  if (!params.inntektId) {
    throw new Error("inntektId mangler i URL");
  }

  const form = useForm({
    submitSource: "state",
    schema: lagreEndringerSchema,
    defaultValues: {
      inntektId: params.inntektId,
      begrunnelse: "",
    },
    method: "post",
    action: "/inntektId/$inntektId/action",
    onSubmitSuccess: () => {
      form.resetForm();
      ref.current?.close();
      setInntektEndret(false);
    },
  });

  const begrunnelse = form.value("begrunnelse");

  useEffect(() => {
    if (uklassifisertInntekt) {
      const uklasifisertInntektMedBegrunnelse = JSON.stringify({
        ...uklassifisertInntekt,
        begrunnelse: begrunnelse,
      });

      form.setValue("payload", uklasifisertInntektMedBegrunnelse);
    }
  }, [uklassifisertInntekt, begrunnelse]);

  return (
    <Box background="surface-default" padding="4" borderRadius="xlarge" borderColor="border-subtle">
      <HStack gap="4" wrap={false} align="center">
        {erEnKvinne(uklassifisertInntekt.mottaker.pnr) ? <KvinneIkon /> : <MennIkon />}
        <HStack gap="4" align="center">
          <BodyShort weight="semibold">{uklassifisertInntekt.mottaker.navn}</BodyShort>
          <BodyShort>/</BodyShort>
          <HStack align="center" gap="2">
            <BodyShort>F.nr: {uklassifisertInntekt.mottaker.pnr}</BodyShort>
            <CopyButton copyText={uklassifisertInntekt.mottaker.pnr} />
          </HStack>
        </HStack>
        <Spacer />
        <HStack gap="4" align="center">
          <Button
            size="small"
            variant="secondary"
            icon={<ArrowCirclepathIcon title="a11y-title" fontSize="1.2rem" />}
            type="submit"
            onClick={() => {
              setUklassifisertInntekt(loaderData);
            }}
          >
            Nullstill endringer
          </Button>
          <Button
            size="small"
            icon={<FloppydiskIcon title="a11y-title" fontSize="1.2rem" />}
            type="submit"
            onClick={() => {
              if (!inntektEndret) {
                globalModalRef?.current?.showModal();
                return;
              }

              ref.current?.showModal();
            }}
          >
            Lagre endringer
          </Button>
          <Modal ref={ref} header={{ heading: "Begrunn og lagre endringer" }} width="medium">
            <form {...form.getFormProps()}>
              <Modal.Body>
                <input type="hidden" name="payload" />
                <input type="hidden" name="inntektId" />
                <Textarea
                  name="begrunnelse"
                  label="Begrunnelse for endringer"
                  error={form.error("begrunnelse")}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button type="submit" loading={state !== "idle"}>
                  Bekreft
                </Button>
                <Button type="button" variant="secondary" onClick={() => ref.current?.close()}>
                  Avbryt
                </Button>
              </Modal.Footer>
            </form>
          </Modal>
        </HStack>
      </HStack>
    </Box>
  );
}
