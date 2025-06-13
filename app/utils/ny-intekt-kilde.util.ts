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
  const virksomhet = { aktoerType: inntektskilde, identifikator: identifikator };

  const inntektsmottaker = {
    aktoerType: identifikator.length === 9 ? "ORGANISASJON" : "NATURLIG_IDENT",
    identifikator: identifikator,
  };

  return inntekter.map((inntekt) => ({
    belop: inntekt.belop,
    fordel: "",
    beskrivelse: inntekstype,
    inntektskilde: "dp-inntekt-frontend",
    inntektsstatus: "LoependeInnrapportert",
    inntektsperiodetype: "Maaned",
    leveringstidspunkt: inntekt.dato,
    utbetaltIMaaned: inntekt.dato,
    virksomhet: virksomhet,
    inntektsmottaker: inntektsmottaker,
    inngaarIGrunnlagForTrekk: null,
    utloeserArbeidsgiveravgift: null,
    informasjonsstatus: null,
    inntektType: null,
    aarMaaned: inntekt.dato,
  }));
}
