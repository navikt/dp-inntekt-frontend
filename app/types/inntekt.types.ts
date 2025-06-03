export interface IUklassifisertInntekt {
  virksomheter: IVirksomhetsinntekt[];
  mottaker: IMottaker;
  periode: IPeriode;
}

export interface IVirksomhetsinntekt {
  virksomhetsnummer: string;
  virksomhetsnavn: string;
  periode: IPeriode;
  inntekter: IInntekt[];
  totalBelop: string;
  avvikListe: IAvvik[];
}

export interface IPeriode {
  fraOgMed: string;
  tilOgMed: string;
}

export interface IInntekt {
  belop: string;
  fordel: string;
  beskrivelse: string;
  inntektskilde: string;
  inntektsstatus: string;
  inntektsperiodetype: string;
  utbetaltIMaaned: string;
  virksomhet: IAktor | null;
  inntektsmottaker: IAktor | null;
  inngaarIGrunnlagForTrekk: boolean | null;
  utloeserArbeidsgiveravgift: boolean | null;
  informasjonsstatus: string | null;
  inntektType: string;
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
  detaljerType: string | null;
  spesielleInntjeningsforhold: ISpesielleInntjeningsforhold | null;
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
  "UNKNOWN",
}

export interface IAvvik {
  ident: IAktor;
  opplysningspliktig: IAktor;
  virksomhet: IAktor | null;
  avvikPeriode: string;
  tekst: string;
}
