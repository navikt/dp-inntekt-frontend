import type { IUklassifisertInntekt, IVirksomhetsinntekt } from "~/types/inntekt.types";

function generateMockInntektDataFromRange(start: string, end: string) {
  const [startYear, startMonth] = start.split("-").map(Number);
  const [endYear, endMonth] = end.split("-").map(Number);

  const data = [];
  let year = startYear;
  let month = startMonth;

  while (year < endYear || (year === endYear && month <= endMonth)) {
    const formattedMonth = `${year}-${String(month).padStart(2, "0")}`;

    data.push({
      belop: "10000.0", // this could be any mock value
      fordel: "kontantytelse",
      beskrivelse: "fastloenn",
      inntektskilde: "A-ordningen",
      inntektsstatus: "LoependeInnrapportert",
      leveringstidspunkt: formattedMonth,
      utbetaltIMaaned: formattedMonth,
      virksomhet: { aktoerType: "ORGANISASJON", identifikator: "896929119" },
      inntektsmottaker: { aktoerType: "AKTOER_ID", identifikator: "2044350291600" },
      inngaarIGrunnlagForTrekk: true,
      utloeserArbeidsgiveravgift: true,
      informasjonsstatus: "InngaarAlltid",
      inntektType: "LOENNSINNTEKT",
      redigert: false,
      begrunnelse: "FASTLOENN",
      aarMaaned: formattedMonth,
      opptjeningsland: "",
      opptjeningsperiode: "",
      skattemessigBosattLand: "",
      opplysningspliktig: null,
      inntektsinnsender: null,
      tilleggsinformasjon: null,
      inntektsperiodetype: "maaned",
    });

    // Increment month
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
  }

  return data;
}

function updateTotalBelop(virksomheter: IVirksomhetsinntekt[]) {
  virksomheter.forEach((virksomhet) => {
    const totalInntekt = virksomhet.inntekter.reduce((sum, inntekt) => {
      return sum + parseInt(inntekt.belop, 10);
    }, 0);

    virksomhet.totalBelop = totalInntekt.toString(); // Update totalBelop with the calculated sum
  });
}

export const mockUklassifisertInntekt: IUklassifisertInntekt = {
  virksomheter: [
    {
      virksomhetsnummer: "937846231",
      virksomhetsnavn: "KIWI NORGE AS",
      periode: { fraOgMed: "2020-12", tilOgMed: "2023-11" },
      inntekter: generateMockInntektDataFromRange("2020-12", "2023-11"),
      totalBelop: "0",
      avvikListe: [],
    },
    {
      virksomhetsnummer: "12092388024",
      virksomhetsnavn: "",
      periode: { fraOgMed: "2021-01", tilOgMed: "2023-12" },
      inntekter: [
        {
          belop: "250000.0",
          fordel: "kontantytelse",
          beskrivelse: "lottKunTrygdeavgift",
          inntektskilde: "A-ordningen",
          inntektsstatus: "LoependeInnrapportert",
          leveringstidspunkt: "2020-12",
          utbetaltIMaaned: "2020-12",
          virksomhet: { aktoerType: "ORGANISASJON", identifikator: "2222222" },
          inntektsmottaker: { aktoerType: "NATURLIG_IDENT", identifikator: "-1" },
          inngaarIGrunnlagForTrekk: true,
          utloeserArbeidsgiveravgift: true,
          informasjonsstatus: "InngaarAlltid",
          inntektType: "NAERINGSINNTEKT",
          redigert: false,
          begrunnelse: "LOTT_KUN_TRYGDEAVGIFT",
          aarMaaned: "2020-12",
          opptjeningsland: "",
          opptjeningsperiode: "",
          skattemessigBosattLand: "",
          opplysningspliktig: null,
          inntektsinnsender: null,
          tilleggsinformasjon: null,
          inntektsperiodetype: "maaned",
        },
        {
          belop: "150000.0",
          fordel: "kontantytelse",
          beskrivelse: "lottKunTrygdeavgift",
          inntektskilde: "A-ordningen",
          inntektsstatus: "LoependeInnrapportert",
          leveringstidspunkt: "2023-11",
          utbetaltIMaaned: "2023-12",
          virksomhet: { aktoerType: "ORGANISASJON", identifikator: "2222222" },
          inntektsmottaker: { aktoerType: "NATURLIG_IDENT", identifikator: "-1" },
          inngaarIGrunnlagForTrekk: true,
          utloeserArbeidsgiveravgift: true,
          informasjonsstatus: "InngaarAlltid",
          inntektType: "NAERINGSINNTEKT",
          redigert: false,
          begrunnelse: "LOTT_KUN_TRYGDEAVGIFT",
          aarMaaned: "2023-11",
          opptjeningsland: "",
          opptjeningsperiode: "",
          skattemessigBosattLand: "",
          opplysningspliktig: null,
          inntektsinnsender: null,
          tilleggsinformasjon: null,
          inntektsperiodetype: "maaned",
        },
      ],
      totalBelop: "0",
      avvikListe: [],
    },
  ],
  mottaker: { pnr: "20443502916", navn: "Ola Nordmann" },
  periode: { fraOgMed: "2020-12", tilOgMed: "2023-11" },
};

updateTotalBelop(mockUklassifisertInntekt.virksomheter);
