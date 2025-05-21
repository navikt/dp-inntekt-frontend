import { z } from "zod";
import type { IGenerertePeriode } from "~/utils/inntekt.util";

export function hentInntektValidationSchema(generertePerioder: IGenerertePeriode[]) {
  const baseSchema = z.object({
    inntektskilde: z.string({
      required_error: "Inntektskilde er påkrevd",
    }),
    organisasjonsnavn: z
      .string({
        required_error: "Organisasjonsnavn er påkrevd",
      })
      .min(1, "Organisasjonsnavn er påkrevd")
      .max(50, "Organisasjonsnavn er for langt"),
    originalData: z.string().optional(),
    organisasjonsnummer: z
      .string({
        required_error: "Organisasjonsnummer er påkrevd",
      })
      .min(1, "Organisasjonsnummer er påkrevd")
      .max(50, "Organisasjonsnummer er for langt"),
    inntektstype: z.string({
      required_error: "Inntektstype er påkrevd",
    }),
  });

  const inntekterSchema: Record<string, z.ZodTypeAny> = {};

  generertePerioder.forEach((year) => {
    year.maneder.forEach((maaned) => {
      if (!maaned.readOnly) {
        inntekterSchema[maaned.dato] = z
          .string()
          .trim()
          .optional()
          .refine((val) => val === undefined || val === "" || !isNaN(Number(val)), {
            message: `Ikke et gyldig tall`,
          })
          .refine((val) => val === undefined || val === "" || Number(val) > 1, {
            message: `Tallet må være større enn 1`,
          });
      }
    });
  });

  return baseSchema.extend(inntekterSchema);
}
