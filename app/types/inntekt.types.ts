export interface IUklassifisertInntekt {
  virksomheter: IVirksomhetsinntekt[];
  mottaker: IMottaker;
  periode: IPeriode;
}

export interface IVirksomhetsinntekt {
  virksomhetsnummer: string;
  virksomhetsnavn: string;
  periode: IPeriode | null;
  inntekter: IInntekt[];
  totalBelop: string;
  avvikListe: IAvvik[];
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
  inntektsperiodetype: string;
  leveringstidspunkt: string | null;
  opptjeningsland: string | null;
  opptjeningsperiode: string | null;
  skattemessigBosattLand: string | null;
  utbetaltIMaaned: string;
  opplysningspliktig: IAktor | null;
  inntektsinnsender: IAktor | null;
  virksomhet: IAktor | null;
  inntektsmottaker: IAktor | null;
  inngaarIGrunnlagForTrekk: boolean | null;
  utloeserArbeidsgiveravgift: boolean | null;
  informasjonsstatus: string | null;
  inntektType: string;
  tilleggsinformasjon: ITilleggsinformasjon | null;
  redigert: boolean;
  begrunnelse: string;
  aarMaaned: string;
}

export interface IAktor {
  aktoerType: string;
  identifikator: string;
}

export interface ITilleggsinformasjon {
  kategori: string | null;
  tilleggsinformasjonDetaljer: ITilleggsInformasjonsDetaljer | null;
}

export interface IMottaker {
  pnr: string;
  navn: string;
}

export interface ITilleggsInformasjonsDetaljer {
  detaljerType: string | null,
  spesielleInntjeningsforhold: ISpesielleInntjeningsforhold | null,
}

export enum ISpesielleInntjeningsforhold {
  "hyreTilMannskapPaaFiskeSmaahvalfangstOgSelfangstfartoey",
  "loennVedArbeidsmarkedstiltak",
  "loennOgAnnenGodtgjoerelseSomIkkeErSkattepliktig",
  "loennUtbetaltFraDenNorskeStatOpptjentIUtlandet",
  "loennVedKonkursEllerStatsgarantiOsv",
  "skattefriArbeidsinntektBarnUnderTrettenAar",
  "statsansattUtlandet",
  "utenlandskeSjoefolkSomIkkeErSkattepliktig",
  "UNKNOWN"
}

export interface IAvvik {
  ident: IAktor;
  opplysningspliktig: IAktor;
  virksomhet: IAktor | null;
  avvikPeriode: string;
  tekst: string;
}