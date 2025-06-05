import type { IInntekt, IVirksomhet } from "~/types/inntekt.types";
import { inntektTyperBeskrivelse } from "./constants";

export interface INyInntektKilde {
  inntektstype: string;
  inntektskilde: string;
  virksomhetsnummer: string;
  periode: { fraOgMed: string; tilOgMed: string };
  inntekter: IFormInntekt[];
}

export interface IFormInntekt {
  dato: string;
  belop: string;
}

export function lagNyInntektskilde(nyInntektKilde: INyInntektKilde): IVirksomhet {
  const { virksomhetsnummer, periode } = nyInntektKilde;

  const generertInntekter = lagNyInntektskildeInntekter(nyInntektKilde);

  const totaltBelop = generertInntekter
    .reduce((sum, inntekt) => sum + Number(inntekt.belop), 0)
    .toString();

  return {
    virksomhetsnummer,
    virksomhetsnavn: "",
    periode,
    inntekter: generertInntekter,
    totalBelop: totaltBelop,
    avvikListe: [],
  };
}

function lagNyInntektskildeInntekter(nyInntektKilde: INyInntektKilde): IInntekt[] {
  const { inntektstype, inntektskilde, virksomhetsnummer, inntekter } = nyInntektKilde;

  const virksomhet = { aktoerType: inntektskilde, identifikator: virksomhetsnummer };

  // Todo: Finn ut om mottaker alltid er en person!
  const inntektsmottaker = {
    aktoerType: "NATURLIG_IDENT",
    identifikator: virksomhetsnummer,
  };

  // Todo: Sjekk disse hardkodede verdiene
  return inntekter.map(({ dato, belop }) => ({
    belop,
    fordel: "",
    beskrivelse:
      inntektTyperBeskrivelse.find((type) => type.key === inntektstype)?.key || inntektstype,
    inntektskilde: "A-ordningen",
    inntektsstatus: "LoependeInnrapportert",
    inntektsperiodetype: "Maaned",
    leveringstidspunkt: dato,
    utbetaltIMaaned: dato,
    virksomhet,
    inntektsmottaker,
    inngaarIGrunnlagForTrekk: true,
    utloeserArbeidsgiveravgift: true,
    informasjonsstatus: "InngaarAlltid",
    inntektType: inntektstype,
    aarMaaned: dato,
  }));
}
