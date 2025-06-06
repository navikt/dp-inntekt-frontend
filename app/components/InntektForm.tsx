import { useForm } from "@rvf/react-router";
import { useEffect } from "react";
import { useParams } from "react-router";
import { z } from "zod";
import { useInntekt } from "~/context/inntekt-context";

const schema = z.object({
  payload: z
    .string({
      required_error: "Inntektskilde er påkrevd",
    })
    .optional(),
  inntektId: z.string({
    required_error: "er påkrevd",
  }),
});

export function InntektForm() {
  const { contextPayload, klarForLagring, setInntektEndret } = useInntekt();
  const params = useParams();

  if (!params.inntektId) {
    throw new Error("inntektId mangler i URL");
  }

  const form = useForm({
    submitSource: "state",
    schema: schema,
    defaultValues: {
      inntektId: params.inntektId,
    },
    method: "post",
    action: "/inntektId/$inntektId/action",
  });

  useEffect(() => {
    if (contextPayload) {
      form.setValue("payload", contextPayload);
    }
  }, [contextPayload]);

  useEffect(() => {
    if (klarForLagring) {
      form.submit();
      setInntektEndret(false);
    }
  }, [klarForLagring]);

  return (
    <form {...form.getFormProps()}>
      <input type="hidden" name="payload" />
      <input type="hidden" name="inntektId" />
    </form>
  );
}
