export interface UklassifisertInntekt {
  inntektVirksomhetMaaned: InntektVirksomhetMaaned[];
  mottaker: Mottaker;
}

export interface InntektVirksomhetMaaned {
  virksomhet: string;
  virksomhetNavn: string;
  periode: Periode;
  inntekter: Inntekt[];
  totalBeløp: string;
  avvikListe: any[]; // You can replace `any` with a more specific type if needed
}

export interface Periode {
  fra: string; // Format: YYYY-MM
  til: string; // Format: YYYY-MM
}

export interface Inntekt {
  belop: string;
  fordel: string;
  beskrivelse: string;
  inntektsKilde: string;
  inntektsStatus: string;
  opptjeningsland: string;
  skattemessigBosattLand: string;
  utbetaltIMaaned: string;
  virksomhet: Aktoer;
  inntektsmottaker: Aktoer;
  inngaarIGrunnlagForTrekk: boolean;
  utloeserArbeidsgiveravgift: boolean;
  informasjonsstatus: string;
  inntektType: string;
  tilleggsinformasjon: Tilleggsinformasjon;
  redigert: boolean;
  begrunnelse: string;
  aarMaaned: string;
}

export interface Aktoer {
  aktoerType: string;
  identifikator: string;
}

export interface Tilleggsinformasjon {
  kategori: string;
}

export interface Mottaker {
  pnr: string;
  navn: string;
}
