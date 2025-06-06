import { z } from "zod";
import type { IGenerertePeriode } from "~/utils/inntekt.util";

export function hentInntektValidationSchema(generertePerioder: IGenerertePeriode[]) {
  const baseSchema = z.object({
    inntektskilde: z.string({
      required_error: "Inntektskilde er påkrevd",
    }),
    identifikator: z.string({
      required_error: "er påkrevd",
    }),
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
            message: `ikke et gyldig tall`,
          })
          .refine((val) => val === undefined || val === "" || Number(val) > 0, {
            message: `må være større enn 0`,
          });
      }
    });
  });

  return baseSchema.extend(inntekterSchema);
}
