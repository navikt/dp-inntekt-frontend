export var mockResponseForHentingAvUklassifisertInntekt = {
    "inntektId": {
        "id": "01JQDYWXG0WA8R7NH6B34682AM"
    },
    "timestamp": "2025-03-28T09:48:23.303864",
    "inntekt": {
        "fraDato": "2024-03",
        "tilDato": "2024-05",
        "arbeidsInntektMaaned": [
            {
                "aarMaaned": "2024-03",
                "avvikListe": [
                    {
                        "ident" : {
                            "aktoerType": "AKTOER_ID",
                            "identifikator": "123456789"
                        },
                        "opplysningspliktig" : {
                            "aktoerType": "NATURLIG_IDENT",
                            "identifikator": "987654321"
                        },
                        "virksomhet" : {
                            "aktoerType": "ORGANISASJON",
                            "identifikator": "11223344"
                        },
                        "avvikPeriode" : "2024-03",
                        "tekst": "Avvik1"
                    }
                ],
                "arbeidsInntektInformasjon": {
                    "inntektListe": [
                        {
                            "beloep": "1121",
                            "fordel": "kontantytelse",
                            "beskrivelse": "lottKunTrygdeavgift",
                            "inntektskilde": "A-ordningen",
                            "inntektsstatus": "LoependeInnrapportert",
                            "inntektsperiodetype": "Maaned",
                            "leveringstidspunkt":"2024-03",
                            "opptjeningsland": "Norge",
                            "opptjeningsperiode": {
                                "startDato": "2024-03-01",
                                "sluttDato":"2024-03-31"
                            },
                            "skattemessigBosattLand": "Norge",
                            "utbetaltIMaaned": "2024-03",
                            "opplysningspliktig": {
                                "aktoerType": "NATURLIG_IDENT",
                                "identifikator": "987654321"
                            },
                            "inntektsinnsender": {
                                "aktoerType": "AKTOER_ID",
                                "identifikator": "123456789"
                            },
                            "virksomhet": {
                                "aktoerType": "ORGANISASJON",
                                "identifikator": "11223344"
                            },
                            "inntektsmottaker":{
                                "aktoerType": "NATURLIG_IDENT",
                                "identifikator": "987654321"
                            },
                            "inngaarIGrunnlagForTrekk": true,
                            "utloeserArbeidsgiveravgift": true,
                            "informasjonsstatus": "InngaarAlltid",
                            "inntektType": "LOENNSINNTEKT",
                            "tilleggsinformasjon": {
                                "kategori": "SpesielleInntjeningsforhold",
                                "tilleggsinformasjonDetaljer": {
                                    "detaljerType": "INNTJENINGSFORHOLD",
                                    "spesielleInntjeningsforhold": "hyreTilMannskapPaaFiskeSmaahvalfangstOgSelfangstfartoey"
                                }
                            },
                            "verdikode": "Hyre - Annet",
                        }
                    ]
                }
            }
        ],
        "ident": {
            "aktoerType": "AKTOER_ID",
            "identifikator": "123456789"
        }
    },
    "manueltRedigert": false,
    "redigertAvSaksbehandler": false,
    "inntektsmottaker": {
        "pnr": "12345678910",
        "navn": "Kari Nordmann"
    }
}