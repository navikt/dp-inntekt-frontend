import type { IInntekt, IInntektVirksomhetMaaned } from "~/types/inntekt.types";

export function sumTotalBelop(inntekter: IInntektVirksomhetMaaned[]): number {
  return inntekter.reduce((sum, item) => sum + Number(item.totalBeløp), 0);
}

const inntektTypeTekst: Record<string, string> = {
  LOENNSINNTEKT: "Lønnsinntekt",
  NAERINGSINNTEKT: "Næringsinntekt",
  PENSJON_ELLER_TRYGD: "Pensjon eller trygd",
  YTELSE_FRA_OFFENTLIGE: "Ytelse fra offentlige",
};

export function hentInntektTypeTekst(type: string): string {
  return inntektTypeTekst[type] ?? "Ukjent inntektstype";
}

export function summerInntekter(inntekter: IInntekt[]) {
  return inntekter.reduce((sum, inntekt) => {
    const belop = parseFloat(inntekt.belop);
    return sum + (isNaN(belop) ? 0 : belop);
  }, 0);
}
