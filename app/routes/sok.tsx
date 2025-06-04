import { Alert, Box, Button, TextField, VStack } from "@navikt/ds-react";
import { useForm } from "@rvf/react-router";
import { redirect } from "react-router";
import invariant from "tiny-invariant";
import { z } from "zod";
import { Header } from "~/components/Header";
import type { Route } from "./+types/sok";

const schema = z.object({
  inntektId: z
    .string({
      required_error: "Inntekt-ID er påkrevd",
    })
    .ulid({ message: "Ugyldig inntekt-ID format" }),
});

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const inntektId = formData.get("inntektId");

  invariant(inntektId, "Mangler inntekt-ID");

  return redirect(`/inntektId/${inntektId}`);
}

export default function Sok() {
  const form = useForm({
    submitSource: "state",
    validationBehaviorConfig: {
      initial: "onSubmit",
      whenTouched: "onSubmit",
      whenSubmitted: "onSubmit",
    },
    method: "put",
    schema,
  });

  return (
    <main>
      <VStack gap="6">
        <Header tittel="Dagpenger inntekt" />

        <Alert variant="error">
          Mangler inntekts-ID. Bruk søkefeltet for å søke etter inntekt.
        </Alert>

        <Box background="surface-default" padding="6" borderRadius="xlarge">
          <form {...form.getFormProps()}>
            <TextField
              name="inntektId"
              label="Søk etter inntekt. Eks: 01JWQT42FY3J0ZTXNZP2PFCAQ0"
              error={form.error("inntektId")}
            />
            <Button type="submit" variant="primary" className="mt-4">
              Søk inntekt
            </Button>
          </form>
        </Box>
      </VStack>
    </main>
  );
}
