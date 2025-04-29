import type { IInntektVirksomhetMaaned } from "~/types/inntekt.types";

export function finnInntektsPeriode(inntekter: IInntektVirksomhetMaaned[]): {
  fra: string;
  til: string;
} {
  if (inntekter.length === 0) {
    throw new Error("Inntekt er en tom liste");
  }

  let tidligsteFraDato = inntekter[0].periode.fra;
  let senesteTilDato = inntekter[0].periode.til;

  for (const inntekt of inntekter) {
    if (inntekt.periode.fra < tidligsteFraDato) {
      tidligsteFraDato = inntekt.periode.fra;
    }
    if (inntekt.periode.til > senesteTilDato) {
      senesteTilDato = inntekt.periode.til;
    }
  }

  return { fra: tidligsteFraDato, til: senesteTilDato };
}

export function sumTotalBelop(inntekter: IInntektVirksomhetMaaned[]): number {
  return inntekter.reduce((sum, item) => sum + Number(item.totalBeløp), 0);
}
