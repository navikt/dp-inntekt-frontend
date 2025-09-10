import type { IInntekt, IPeriode } from "~/types/inntekt.types";

export interface IFormInntekt {
  dato: string;
  belop: string;
}

export function finnTidligsteOgSenesteDato(inntekter: IInntekt[]): IPeriode {
  const datoer = inntekter.map((inntekt) => inntekt.aarMaaned).sort();

  return {
    fraOgMed: datoer[0],
    tilOgMed: datoer[datoer.length - 1],
  };
}

export function finnTotalBelop(inntekter: IInntekt[]): string {
  return inntekter.reduce((sum, inntekt) => sum + Number(inntekt.belop), 0).toString();
}

export function lagInntektListe(
  beskrivelse: string,
  inntektskilde: string,
  identifikator: string,
  inntekter: IFormInntekt[]
): IInntekt[] {
  const virksomhet = {
    aktoerType: inntektskilde,
    identifikator: identifikator,
  };

  const inntektsmottaker = {
    aktoerType: "NATURLIG_IDENT",
    identifikator: identifikator,
  };

  return inntekter.map((inntekt) => ({
    belop: inntekt.belop,
    fordel: "",
    beskrivelse: beskrivelse,
    inntektskilde: "Saksbehandler",
    inntektsstatus: "",
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
