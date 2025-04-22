export var mockResponseForHentingAvUklassifisertInntekt: UklassifisertInntektResponse = {
  inntektId: {
    id: "01JQDYWXG0WA8R7NH6B34682AM",
  },
  timestamp: "2025-03-28T09:48:23.303864",
  inntekt: {
    fraDato: "2024-03",
    tilDato: "2024-05",
    arbeidsInntektMaaned: [
      {
        aarMaaned: "2024-03",
        avvikListe: [
          {
            ident: {
              aktoerType: "AKTOER_ID",
              identifikator: "123456789",
            },
            opplysningspliktig: {
              aktoerType: "NATURLIG_IDENT",
              identifikator: "987654321",
            },
            virksomhet: {
              aktoerType: "ORGANISASJON",
              identifikator: "11223344",
            },
            avvikPeriode: "2024-03",
            tekst: "Avvik1",
          },
        ],
        arbeidsInntektInformasjon: {
          inntektListe: [
            {
              beloep: "1121",
              fordel: "kontantytelse",
              beskrivelse: "lottKunTrygdeavgift",
              inntektskilde: "A-ordningen",
              inntektsstatus: "LoependeInnrapportert",
              inntektsperiodetype: "Maaned",
              leveringstidspunkt: "2024-03",
              opptjeningsland: "Norge",
              opptjeningsperiode: {
                startDato: "2024-03-01",
                sluttDato: "2024-03-31",
              },
              skattemessigBosattLand: "Norge",
              utbetaltIMaaned: "2024-03",
              opplysningspliktig: {
                aktoerType: "NATURLIG_IDENT",
                identifikator: "987654321",
              },
              inntektsinnsender: {
                aktoerType: "AKTOER_ID",
                identifikator: "123456789",
              },
              virksomhet: {
                aktoerType: "ORGANISASJON",
                identifikator: "11223344",
              },
              inntektsmottaker: {
                aktoerType: "NATURLIG_IDENT",
                identifikator: "987654321",
              },
              inngaarIGrunnlagForTrekk: true,
              utloeserArbeidsgiveravgift: true,
              informasjonsstatus: "InngaarAlltid",
              inntektType: "LOENNSINNTEKT",
              tilleggsinformasjon: {
                kategori: "SpesielleInntjeningsforhold",
                tilleggsinformasjonDetaljer: {
                  detaljerType: "INNTJENINGSFORHOLD",
                  spesielleInntjeningsforhold:
                    "hyreTilMannskapPaaFiskeSmaahvalfangstOgSelfangstfartoey",
                },
              },
              verdikode: "Hyre - Annet",
            },
          ],
        },
      },
    ],
    ident: {
      aktoerType: "AKTOER_ID",
      identifikator: "123456789",
    },
  },
  manueltRedigert: false,
  redigertAvSaksbehandler: false,
  inntektsmottaker: {
    pnr: "12345678910",
    navn: "Kari Nordmann",
  },
};

export const mockKlassifisertInntektResponse = {
  inntektsId: "01JRFXF1J0V27WEWWGSBWJQ988",
  inntektsListe: [
    {
      årMåned: "2022-04",
      klassifiserteInntekter: [
        {
          beløp: "50000.0",
          inntektKlasse: "ARBEIDSINNTEKT",
        },
      ],
      harAvvik: false,
    },
    {
      årMåned: "2022-05",
      klassifiserteInntekter: [
        {
          beløp: "50000.0",
          inntektKlasse: "ARBEIDSINNTEKT",
        },
      ],
      harAvvik: false,
    },
    {
      årMåned: "2022-06",
      klassifiserteInntekter: [
        {
          beløp: "50000.0",
          inntektKlasse: "ARBEIDSINNTEKT",
        },
      ],
      harAvvik: false,
    },
    {
      årMåned: "2022-07",
      klassifiserteInntekter: [
        {
          beløp: "50000.0",
          inntektKlasse: "ARBEIDSINNTEKT",
        },
      ],
      harAvvik: false,
    },
    {
      årMåned: "2022-08",
      klassifiserteInntekter: [
        {
          beløp: "50000.0",
          inntektKlasse: "ARBEIDSINNTEKT",
        },
      ],
      harAvvik: false,
    },
    {
      årMåned: "2022-09",
      klassifiserteInntekter: [
        {
          beløp: "50000.0",
          inntektKlasse: "ARBEIDSINNTEKT",
        },
      ],
      harAvvik: false,
    },
    {
      årMåned: "2022-10",
      klassifiserteInntekter: [
        {
          beløp: "50000.0",
          inntektKlasse: "ARBEIDSINNTEKT",
        },
      ],
      harAvvik: false,
    },
    {
      årMåned: "2022-11",
      klassifiserteInntekter: [
        {
          beløp: "50000.0",
          inntektKlasse: "ARBEIDSINNTEKT",
        },
      ],
      harAvvik: false,
    },
    {
      årMåned: "2022-12",
      klassifiserteInntekter: [
        {
          beløp: "50000.0",
          inntektKlasse: "ARBEIDSINNTEKT",
        },
      ],
      harAvvik: false,
    },
    {
      årMåned: "2023-04",
      klassifiserteInntekter: [
        {
          beløp: "50000.0",
          inntektKlasse: "ARBEIDSINNTEKT",
        },
      ],
      harAvvik: false,
    },
    {
      årMåned: "2023-01",
      klassifiserteInntekter: [
        {
          beløp: "50000.0",
          inntektKlasse: "ARBEIDSINNTEKT",
        },
      ],
      harAvvik: false,
    },
    {
      årMåned: "2023-02",
      klassifiserteInntekter: [
        {
          beløp: "50000.0",
          inntektKlasse: "ARBEIDSINNTEKT",
        },
      ],
      harAvvik: false,
    },
    {
      årMåned: "2023-03",
      klassifiserteInntekter: [
        {
          beløp: "50000.0",
          inntektKlasse: "ARBEIDSINNTEKT",
        },
      ],
      harAvvik: false,
    },
    {
      årMåned: "2023-05",
      klassifiserteInntekter: [
        {
          beløp: "50000.0",
          inntektKlasse: "ARBEIDSINNTEKT",
        },
      ],
      harAvvik: false,
    },
    {
      årMåned: "2023-06",
      klassifiserteInntekter: [
        {
          beløp: "50000.0",
          inntektKlasse: "ARBEIDSINNTEKT",
        },
      ],
      harAvvik: false,
    },
    {
      årMåned: "2023-07",
      klassifiserteInntekter: [
        {
          beløp: "50000.0",
          inntektKlasse: "ARBEIDSINNTEKT",
        },
      ],
      harAvvik: false,
    },
    {
      årMåned: "2023-08",
      klassifiserteInntekter: [
        {
          beløp: "50000.0",
          inntektKlasse: "ARBEIDSINNTEKT",
        },
      ],
      harAvvik: false,
    },
    {
      årMåned: "2023-09",
      klassifiserteInntekter: [
        {
          beløp: "50000.0",
          inntektKlasse: "ARBEIDSINNTEKT",
        },
      ],
      harAvvik: false,
    },
    {
      årMåned: "2023-10",
      klassifiserteInntekter: [
        {
          beløp: "50000.0",
          inntektKlasse: "ARBEIDSINNTEKT",
        },
      ],
      harAvvik: false,
    },
    {
      årMåned: "2023-11",
      klassifiserteInntekter: [
        {
          beløp: "50000.0",
          inntektKlasse: "ARBEIDSINNTEKT",
        },
      ],
      harAvvik: false,
    },
    {
      årMåned: "2023-12",
      klassifiserteInntekter: [
        {
          beløp: "50000.0",
          inntektKlasse: "ARBEIDSINNTEKT",
        },
      ],
      harAvvik: false,
    },
    {
      årMåned: "2024-01",
      klassifiserteInntekter: [
        {
          beløp: "50000.0",
          inntektKlasse: "ARBEIDSINNTEKT",
        },
      ],
      harAvvik: false,
    },
    {
      årMåned: "2024-02",
      klassifiserteInntekter: [
        {
          beløp: "50000.0",
          inntektKlasse: "ARBEIDSINNTEKT",
        },
      ],
      harAvvik: false,
    },
    {
      årMåned: "2024-03",
      klassifiserteInntekter: [
        {
          beløp: "50000.0",
          inntektKlasse: "ARBEIDSINNTEKT",
        },
      ],
      harAvvik: false,
    },
  ],
  manueltRedigert: false,
  sisteAvsluttendeKalenderMåned: "2025-03",
};
