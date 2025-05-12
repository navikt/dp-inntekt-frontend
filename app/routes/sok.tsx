import { Alert, Box, Button, TextField, VStack } from "@navikt/ds-react";
import { useForm } from "@rvf/react-router";
import { redirect } from "react-router";
import invariant from "tiny-invariant";
import { z } from "zod";
import { Header } from "~/components/Header";
import type { Route } from "./+types/feil";

const schema = z.object({
  inntektsId: z
    .string({
      required_error: "Inntekts-ID er påkrevd",
    })
    .ulid({ message: "Ugyldig inntekts-ID format" }),
});

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const inntektsId = formData.get("inntektsId");

  invariant(inntektsId, " Mangler inntekts-ID");

  return redirect(`/?inntektsId=${inntektsId}`);
}

export default function Sok() {
  const form = useForm({
    submitSource: "state",
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
              name="inntektsId"
              label="Søk etter inntekt"
              placeholder="Eks: 01ARZ3NDEKTSV4RRFFQ69G5FAV"
              error={form.error("inntektsId")}
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
