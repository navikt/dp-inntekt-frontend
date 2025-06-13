import type { IInntekt, IPeriode } from "~/types/inntekt.types";
import { inntektTyperBeskrivelse } from "./constants";

export interface IFormInntekt {
  dato: string;
  belop: string;
}

export function finnTidligsteOgSenesteDato(inntekter: IFormInntekt[]): IPeriode {
  const datoer = inntekter.map((inntekt) => inntekt.dato).sort();

  return {
    fraOgMed: datoer[0],
    tilOgMed: datoer[datoer.length - 1],
  };
}

export function finnTotalBelop(inntekter: IFormInntekt[]): string {
  return inntekter.reduce((sum, inntekt) => sum + Number(inntekt.belop), 0).toString();
}

export function lagInntektListe(
  inntekstype: string,
  inntektskilde: string,
  identifikator: string,
  inntekter: IFormInntekt[]
): IInntekt[] {
  return inntekter.map((inntekt) => ({
    belop: inntekt.belop,
    fordel: "",
    beskrivelse:
      inntektTyperBeskrivelse.find((type) => type.key === inntekstype)?.key || inntekstype,
    inntektskilde: inntektskilde,
    inntektsstatus: "LoependeInnrapportert",
    inntektsperiodetype: "Maaned",
    leveringstidspunkt: inntekt.dato,
    utbetaltIMaaned: inntekt.dato,
    virksomhet: { aktoerType: "NATURLIG_IDENT", identifikator },
    inntektsmottaker: { aktoerType: "NATURLIG_IDENT", identifikator },
    inngaarIGrunnlagForTrekk: true,
    utloeserArbeidsgiveravgift: true,
    informasjonsstatus: "InngaarAlltid",
    inntektType: "LOENNSINNTEKT",
    aarMaaned: inntekt.dato,
  }));
}
