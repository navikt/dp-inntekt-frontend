export interface IUklassifisertInntekt {
  inntektVirksomhetMaaned: IInntektVirksomhetMaaned[];
  mottaker: IMottaker;
}

export interface IInntektVirksomhetMaaned {
  virksomhet: string;
  virksomhetNavn: string;
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
  inntektsKilde: string;
  inntektsStatus: string;
  opptjeningsland: string;
  skattemessigBosattLand: string;
  utbetaltIMaaned: string;
  virksomhet: IAktoer;
  inntektsmottaker: IAktoer;
  inngaarIGrunnlagForTrekk: boolean;
  utloeserArbeidsgiveravgift: boolean;
  informasjonsstatus: string;
  inntektType: string;
  tilleggsinformasjon: ITilleggsinformasjon;
  redigert: boolean;
  begrunnelse: string;
  aarMaaned: string;
}

export interface IAktoer {
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
