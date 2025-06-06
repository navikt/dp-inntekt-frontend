import type { IInntekt, IPeriode, IVirksomhet } from "~/types/inntekt.types";
import { inntektTyperBeskrivelse } from "./constants";

export interface INyVirksomhet {
  inntektstype: string;
  inntektskilde: string;
  identifikator: string;
  identifikatorsnavn: string;
  inntekter: IFormInntekt[];
}

export interface IFormInntekt {
  dato: string;
  belop: string;
}

export function lagNyVirksomhet(nyInntektKilde: INyVirksomhet): IVirksomhet {
  const { identifikator, identifikatorsnavn } = nyInntektKilde;

  const generertInntekter = lagNyInntektskildeInntekter(nyInntektKilde);
  const periode = finnTidligsteOgSenesteDato(nyInntektKilde.inntekter);

  const totaltBelop = generertInntekter
    .reduce((sum, inntekt) => sum + Number(inntekt.belop), 0)
    .toString();

  return {
    virksomhetsnummer: identifikator,
    virksomhetsnavn: identifikatorsnavn ?? "",
    periode: periode,
    inntekter: generertInntekter,
    totalBelop: totaltBelop,
    avvikListe: [],
  };
}

export function finnTidligsteOgSenesteDato(inntekter: IFormInntekt[]): IPeriode {
  const datoer = inntekter.map((inntekt) => inntekt.dato).sort();

  return {
    fraOgMed: datoer[0],
    tilOgMed: datoer[datoer.length - 1],
  };
}

function lagNyInntektskildeInntekter(nyInntektKilde: INyVirksomhet): IInntekt[] {
  const { inntektstype, inntektskilde, identifikator, inntekter } = nyInntektKilde;

  const virksomhet = { aktoerType: inntektskilde, identifikator: identifikator };

  // Todo: Finn ut om mottaker alltid er en person!
  const inntektsmottaker = {
    aktoerType: "NATURLIG_IDENT",
    identifikator: identifikator,
  };

  // Todo: Sjekk disse hardkodede verdiene
  // Todo: Sjekk disse hardkodede verdiene
  return inntekter.map(({ dato, belop }) => ({
    belop: belop,
    fordel: "",
    // beskrivelse:
    // inntektTyperBeskrivelse.find((type) => type.key === inntektstype)?.key || inntektstype,
    beskrivelse: "fastloenn",
    inntektskilde: "A-ordningen",
    inntektsstatus: "LoependeInnrapportert",
    inntektsperiodetype: "Maaned",
    leveringstidspunkt: dato,
    utbetaltIMaaned: dato,
    virksomhet: virksomhet,
    inntektsmottaker: inntektsmottaker,
    inngaarIGrunnlagForTrekk: true,
    utloeserArbeidsgiveravgift: true,
    informasjonsstatus: "InngaarAlltid",
    inntektType: "LOENNSINNTEKT",
    aarMaaned: dato,
  }));
}
