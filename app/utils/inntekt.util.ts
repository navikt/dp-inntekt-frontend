import type { InntektVirksomhetMaaned } from "~/types/inntekt.types";

export function finnInntektsPeriode(inntekter: InntektVirksomhetMaaned[]): {
  fra: string;
  til: string;
} {
  if (inntekter.length === 0) {
    throw new Error("Inntekt er en tom liste");
  }

  let fom = inntekter[0].periode.fra;
  let tom = inntekter[0].periode.til;

  for (const item of inntekter) {
    if (item.periode.fra < fom) {
      fom = item.periode.fra;
    }
    if (item.periode.til > tom) {
      tom = item.periode.til;
    }
  }

  return { fra: fom, til: tom };
}

export function sumTotalBelop(data: InntektVirksomhetMaaned[]): number {
  return data.reduce((sum, item) => sum + Number(item.totalBeløp), 0);
}
