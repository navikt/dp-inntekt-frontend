import { Box, Button, HStack, TextField, VStack } from "@navikt/ds-react";
import { useForm } from "@rvf/react-router";
import { redirect, useNavigation } from "react-router";
import invariant from "tiny-invariant";
import { z } from "zod";
import { Header } from "~/components/Header";
import type { Route } from "./+types/sok";
import { InntektProvider } from "~/context/inntekt-context";
import { mockUklassifisertInntekt } from "~/mocks/mock.uklassifiert-inntekt";

const schema = z.object({
  inntektId: z
    .string({
      required_error: "Inntekt-ID er påkrevd",
    })
    .ulid({ message: "Ugyldig inntekt-ID format" }),
  opplysningId: z
    .string({
      required_error: "Opplysning-ID er påkrevd",
    })
    .uuid({ message: "Ugyldig opplysning-ID format" }),
  behandlingId: z
    .string({
      required_error: "Behandling-ID er påkrevd",
    })
    .uuid({ message: "Ugyldig behandling-ID format" }),
});

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const inntektId = formData.get("inntektId");
  const opplysningId = formData.get("opplysningId");
  const behandlingId = formData.get("behandlingId");

  invariant(inntektId, "Mangler inntekt-ID");
  invariant(opplysningId, "Mangler opplysning-ID");
  invariant(behandlingId, "Mangler behandling-ID");

  return redirect(
    `/inntektId/${inntektId}?opplysningId=${opplysningId}&behandlingId=${behandlingId}`
  );
}

export default function Sok() {
  const { state } = useNavigation();

  const testInntektId = "01JWQT42FY3J0ZTXNZP2PFCAQ0";
  const testOpplysningId = "123e4567-e89b-12d3-a456-426614174000";
  const testBehandlingId = "123e4567-e89b-12d3-a456-426614174000";

  const form = useForm({
    submitSource: "state",
    validationBehaviorConfig: {
      initial: "onSubmit",
      whenTouched: "onSubmit",
      whenSubmitted: "onSubmit",
    },
    method: "put",
    schema,
    defaultValues: {
      inntektId: testInntektId,
      opplysningId: testOpplysningId,
      behandlingId: testBehandlingId,
    },
  });

  return (
    <InntektProvider uklassifisertInntekt={mockUklassifisertInntekt} slettModalRef={undefined}>
      <main>
        <VStack gap="6">
          <Header tittel="Dagpenger inntekt" />
          <Box background="surface-default" padding="6" borderRadius="xlarge">
            <form {...form.getFormProps()}>
              <VStack gap="4">
                <TextField
                  {...form.getInputProps("inntektId")}
                  error={form.error("inntektId")}
                  label="InntektId: ULID-format, 26 tegn"
                />
                <TextField
                  {...form.getInputProps("opplysningId")}
                  error={form.error("opplysningId")}
                  label="OpplysningId: UUID-format, 36 tegn"
                />
                <TextField
                  {...form.getInputProps("behandlingId")}
                  error={form.error("behandlingId")}
                  label="BehandlingId: UUID-format, 36 tegn"
                />
              </VStack>

              <Button type="submit" variant="primary" className="mt-4" loading={state !== "idle"}>
                Søk inntekt
              </Button>

              <VStack align="start" className="mt-8">
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-4"
                  loading={state !== "idle"}
                  onClick={() => {
                    window.location.href = `/inntektId/${testInntektId}?opplysningId=${testOpplysningId}&behandlingId=${testBehandlingId}`;
                  }}
                >
                  Hopp til DP-SAK inntekt
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  className="mt-4"
                  loading={state !== "idle"}
                  onClick={() => {
                    window.location.href = `/inntektId/${testInntektId}?erArena=true`;
                  }}
                >
                  Hopp til ARENA inntekt
                </Button>
              </VStack>
            </form>
          </Box>
        </VStack>
      </main>
    </InntektProvider>
  );
}
