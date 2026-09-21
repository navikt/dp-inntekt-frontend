import { z } from "zod";

export const lagreEndringerSchema = z.object({
  payload: z
    .string({
      error: "Payload er påkrevd",
    })
    .optional(),
  inntektId: z.string({
    error: "InntektId er påkrevd",
  }),
  behandlingId: z.string({
    error: "BehandlingId er påkrevd",
  }).optional(),
  opplysningId: z.string({
    error: "OpplysningId er påkrevd",
  }).optional(),
  begrunnelse: z
    .string({
      error: "Begrunnelse er påkrevd",
    })
    .refine((val) => /[a-zA-ZæøåÆØÅ]/.test(val ?? ""), {
      message: "Begrunnelse må inneholde minst én bokstav",
    }),
  erArena: z.string().optional(),
});
