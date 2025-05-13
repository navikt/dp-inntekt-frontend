export interface IUklassifisertInntekt {
  virksomhetsinntekt: IVirksomhetsinntekt[];
  mottaker: IMottaker;
  periode: IPeriode;
}

export interface IVirksomhetsinntekt {
  virksomhetsnummer: string;
  virksomhetsnavn: string;
  periode: IPeriode;
  inntekter: IInntekt[];
  totalBeløp: string;
  avvikListe: any[]; // You can replace `any` with a more specific type if needed
}

export interface IPeriode {
  fra: string; // Format: YYYY-MM
  til: string; // Format: YYYY-MM
}

export interface IInntekt {
  belop: string;
  fordel: string;
  beskrivelse: string;
  inntektskilde: string;
  inntektsstatus: string;
  leveringstidspunkt: string;
  utbetaltIMaaned: string;
  virksomhet: IAktor;
  inntektsmottaker: IAktor;
  inngaarIGrunnlagForTrekk: boolean;
  utloeserArbeidsgiveravgift: boolean;
  informasjonsstatus: string;
  inntektType: string;
  redigert: boolean;
  begrunnelse: string;
  aarMaaned: string;
}

export interface IAktor {
  aktoerType: string;
  identifikator: string;
}

export interface ITilleggsinformasjon {
  kategori: string;
}

export interface IMottaker {
  pnr: string;
  navn: string;
}
