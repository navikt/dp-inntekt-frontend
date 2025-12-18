import { z } from "zod";

export const lagreEndringerSchema = z.object({
  payload: z
    .string({
      required_error: "Payload er påkrevd",
    })
    .optional(),
  inntektId: z.string({
    required_error: "InntektId er påkrevd",
  }),
  behandlingId: z.string({
    required_error: "BehandlingId er påkrevd",
  }),
  opplysningId: z.string({
    required_error: "OpplysningId er påkrevd",
  }),
  begrunnelse: z
    .string({
      required_error: "Begrunnelse er påkrevd",
    })
    .refine((val) => /[a-zA-ZæøåÆØÅ]/.test(val ?? ""), {
      message: "Begrunnelse må inneholde minst én bokstav",
    }),
});
