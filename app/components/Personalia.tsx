import { FloppydiskIcon } from "@navikt/aksel-icons";
import {
  BodyLong,
  BodyShort,
  Box,
  Button,
  CopyButton,
  Detail,
  HStack,
  Modal,
  Spacer,
  Textarea,
} from "@navikt/ds-react";
import { useForm } from "@rvf/react-router";
import { useEffect, useRef, useState } from "react";
import { useNavigation, useParams, useSearchParams } from "react-router";
import { HentInntektPaNyttModal } from "~/components/HentInntektPaNyttModal";
import { useInntekt } from "~/context/inntekt-context";
import { erEnKvinne } from "~/utils/generell.util";
import { lagreEndringerSchema } from "~/validation-schema/lagre-endringer-schema";
import { KvinneIkon } from "./Ikoner/KvinneIkon";
import { MennIkon } from "./Ikoner/MennIkon";
import { maskerVerdi } from "~/utils/skjul-sensitiv-opplysning";

export function Personalia() {
  let [searchParams] = useSearchParams();
  const params = useParams();
  const { state } = useNavigation();
  const { inntektEndret, uklassifisertInntekt, setInntektEndret, skjulSensitiveOpplysninger } =
    useInntekt();
  const lagreInntektModalRef = useRef<HTMLDialogElement>(null);
  const ingenEndringerModalRef = useRef<HTMLDialogElement>(null);
  const opplysningId = searchParams.get("opplysningId");
  const behandlingId = searchParams.get("behandlingId");
  const erArena = searchParams.get("erArena") || "false";

  const erArenaBoolean = erArena === "true";
  const manglerDpSakIder = !opplysningId || !behandlingId;

  if (!params.inntektId || (!erArenaBoolean && manglerDpSakIder)) {
    throw new Error("inntektId, behandlingId eller opplysningId mangler i URL");
  }

  const form = useForm({
    submitSource: "state",
    schema: lagreEndringerSchema,
    defaultValues: {
      inntektId: params.inntektId,
      behandlingId: behandlingId || undefined,
      opplysningId: opplysningId || undefined,
      begrunnelse: "",
      erArena: erArena,
    },
    method: "post",
    action: "/inntektId/$inntektId/action",
    onSubmitSuccess: () => {
      form.resetForm();
      lagreInntektModalRef.current?.close();
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

  const timestamp = new Date(uklassifisertInntekt.timestamp!!).toLocaleString("no-NO", {
    timeZone: "Europe/Oslo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Box background="surface-default" padding="4" borderRadius="xlarge" borderColor="border-subtle">
      <HStack gap="4" wrap={false} align="center">
        {erEnKvinne(uklassifisertInntekt.mottaker.pnr) ? <KvinneIkon /> : <MennIkon />}
        <HStack gap="4" align="center">
          <BodyShort weight="semibold">
            {skjulSensitiveOpplysninger
              ? maskerVerdi(uklassifisertInntekt.mottaker.navn)
              : uklassifisertInntekt.mottaker.navn}
          </BodyShort>
          <BodyShort>/</BodyShort>
          <HStack align="center" gap="2">
            <BodyShort>
              F.nr:{" "}
              {skjulSensitiveOpplysninger
                ? maskerVerdi(uklassifisertInntekt.mottaker.pnr)
                : uklassifisertInntekt.mottaker.pnr}
            </BodyShort>
            <CopyButton copyText={uklassifisertInntekt.mottaker.pnr} />
          </HStack>
        </HStack>
        <Spacer />
        <HStack gap="4" align="center">
          <Detail>
            <strong> Sist hentet fra A-Inntekt:</strong> {timestamp}
          </Detail>
          <HentInntektPaNyttModal inntektId={params.inntektId} />

          <Button
            size="small"
            icon={<FloppydiskIcon title="a11y-title" fontSize="1.2rem" />}
            type="submit"
            onClick={() => {
              if (!inntektEndret) {
                ingenEndringerModalRef?.current?.showModal();
                return;
              }

              lagreInntektModalRef.current?.showModal();
            }}
          >
            Lagre endringer
          </Button>
          <Modal
            ref={lagreInntektModalRef}
            header={{ heading: "Begrunn og lagre endringer" }}
            width="medium"
          >
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
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => lagreInntektModalRef.current?.close()}
                >
                  Avbryt
                </Button>
              </Modal.Footer>
            </form>
          </Modal>
          <Modal
            ref={ingenEndringerModalRef}
            header={{
              heading: "Du har ingen endring å lagre",
            }}
            width="medium"
          >
            <Modal.Body>
              <BodyLong>Du har ikke gjort noen endringer som kan lagres.</BodyLong>
            </Modal.Body>
          </Modal>
        </HStack>
      </HStack>
    </Box>
  );
}
