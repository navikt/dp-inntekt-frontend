type UklassifisertInntektResponse = {
    inntektId: {
        id: string;
    };
    timestamp: string;
    inntekt: Inntekt;
    manueltRedigert: boolean;
    redigertAvSaksbehandler: boolean;
    inntektsmottaker: Inntektsmottaker;
};

type Inntekt = {
    fraDato: string;
    tilDato: string;
    arbeidsInntektMaaned: ArbeidsInntektMaaned[];
    ident: Ident;
}

type ArbeidsInntektMaaned = {
    aarMaaned: string;
    avvikListe: Avvik[];
    arbeidsInntektInformasjon: {
        inntektListe: InntektListObjekt[];
    };
};

type Avvik = {
    ident: Ident;
    opplysningspliktig: Ident;
    virksomhet: Ident;
    avvikPeriode: string;
    tekst: string;
};

type InntektListObjekt = {
    beloep: string;
    fordel: string;
    beskrivelse: string;
    inntektskilde: string;
    inntektsstatus: string;
    inntektsperiodetype: string;
    leveringstidspunkt: string;
    opptjeningsland: string;
    opptjeningsperiode: Opptjeningsperiode;
    skattemessigBosattLand: string;
    utbetaltIMaaned: string;
    opplysningspliktig: Ident;
    inntektsinnsender: Ident;
    virksomhet: Ident;
    inntektsmottaker: Ident;
    inngaarIGrunnlagForTrekk: boolean;
    utloeserArbeidsgiveravgift: boolean;
    informasjonsstatus: string;
    inntektType: string;
    tilleggsinformasjon: TilleggsInformasjon;
    verdikode: string;
};

type Opptjeningsperiode = {
    startDato: string;
    sluttDato: string;
}

type TilleggsInformasjon = {
    kategori: string;
    tilleggsinformasjonDetaljer: TilleggsInformasjonDetaljer;
}

type TilleggsInformasjonDetaljer = {
    detaljerType: string;
    spesielleInntjeningsforhold: string;
}

type Ident = {
    aktoerType: string;
    identifikator: string;
};

type Inntektsmottaker = {
    pnr: string;
    navn: string;
};