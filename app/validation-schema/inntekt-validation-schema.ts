import { z } from "zod";
import { parseNorskBeløpTilNumber, type IGenerertePeriode } from "~/utils/inntekt.util";

// Godtar heltall og desimaler med koma, og maks 2 desimalsiffer
// (f.eks. "1000", "12,5", "1000,50")
const gyldigBelopFormat = /^\d+(,\d{1,2})?$/;

export function hentInntektValidationSchema(generertePerioder: IGenerertePeriode[]) {
  const baseSchema = z.object({
    inntektskilde: z.string({
      required_error: "Inntektskilde er påkrevd",
    }),
    identifikator: z.string({
      required_error: "er påkrevd",
    }),
    beskrivelse: z
      .string({
        required_error: "Inntektstype er påkrevd",
      })
      .min(1, "Inntektstype er påkrevd"),
  });

  const inntekterSchema: Record<string, z.ZodTypeAny> = {};

  generertePerioder.forEach((year) => {
    year.maneder.forEach((maaned) => {
      if (!maaned.readOnly) {
        inntekterSchema[maaned.dato] = z
          .string()
          .trim()
          .optional()
          .refine((val) => val === undefined || val === "" || gyldigBelopFormat.test(val), {
            message: `ikke et gyldig tall`,
          })
          .refine((val) => val === undefined || val === "" || parseNorskBeløpTilNumber(val) > 0, {
            message: `må være større enn 0`,
          });
      }
    });
  });

  return baseSchema.extend(inntekterSchema);
}
