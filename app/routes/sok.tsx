import { Box, Button, TextField, VStack } from "@navikt/ds-react";
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
      inntektId: "",
      opplysningId: "",
      behandlingId: "",
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
                  name="inntektId"
                  label="Søk etter inntektId. Eks: 01JWQT42FY3J0ZTXNZP2PFCAQ0"
                  error={form.error("inntektId")}
                />
                <TextField
                  name="opplysningId"
                  label="Søk etter opplysningId. Eks: 123e4567-e89b-12d3-a456-426614174000"
                  error={form.error("opplysningId")}
                />
                <TextField
                  name="behandlingId"
                  label="Søk etter behandlingId. Eks: 123e4567-e89b-12d3-a456-426614174000"
                  error={form.error("behandlingId")}
                />
              </VStack>
              <Button type="submit" variant="primary" className="mt-4" loading={state !== "idle"}>
                Søk inntekt
              </Button>
            </form>
          </Box>
        </VStack>
      </main>
    </InntektProvider>
  );
}
