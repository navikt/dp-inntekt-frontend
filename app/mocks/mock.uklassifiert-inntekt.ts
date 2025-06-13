import type { IInntekt, IUklassifisertInntekt, IVirksomhet } from "~/types/inntekt.types";

function generateMockInntektDataFromRange(start: string, end: string): IInntekt[] {
  const [startYear, startMonth] = start.split("-").map(Number);
  const [endYear, endMonth] = end.split("-").map(Number);

  const data: IInntekt[] = [];
  let year = startYear;
  let month = startMonth;

  while (year < endYear || (year === endYear && month <= endMonth)) {
    const formattedMonth = `${year}-${String(month).padStart(2, "0")}`;

    data.push({
      belop: "10000.0", // this could be any mock value
      fordel: "kontantytelse",
      beskrivelse: "fastloenn",
      inntektskilde: "dp-inntekt-frontend",
      inntektsstatus: "LoependeInnrapportert",
      utbetaltIMaaned: formattedMonth,
      virksomhet: { aktoerType: "ORGANISASJON", identifikator: "896929119" },
      inntektsmottaker: { aktoerType: "AKTOER_ID", identifikator: "2044350291600" },
      inngaarIGrunnlagForTrekk: true,
      utloeserArbeidsgiveravgift: true,
      informasjonsstatus: null,
      inntektType: "LOENNSINNTEKT",
      aarMaaned: formattedMonth,
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

function updateTotalBelop(virksomheter: IVirksomhet[]) {
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
          utbetaltIMaaned: "2020-12",
          virksomhet: { aktoerType: "ORGANISASJON", identifikator: "2222222" },
          inntektsmottaker: { aktoerType: "NATURLIG_IDENT", identifikator: "-1" },
          inngaarIGrunnlagForTrekk: null,
          utloeserArbeidsgiveravgift: null,
          informasjonsstatus: null,
          inntektType: null,
          aarMaaned: "2020-12",
          inntektsperiodetype: "maaned",
        },
        {
          belop: "150000.0",
          fordel: "kontantytelse",
          beskrivelse: "lottKunTrygdeavgift",
          inntektskilde: "A-ordningen",
          inntektsstatus: "LoependeInnrapportert",
          utbetaltIMaaned: "2023-12",
          virksomhet: { aktoerType: "ORGANISASJON", identifikator: "2222222" },
          inntektsmottaker: { aktoerType: "NATURLIG_IDENT", identifikator: "-1" },
          inngaarIGrunnlagForTrekk: true,
          utloeserArbeidsgiveravgift: true,
          informasjonsstatus: null,
          inntektType: null,
          aarMaaned: "2023-11",
          inntektsperiodetype: "maaned",
        },
        {
          belop: "150000.0",
          fordel: "kontantytelse",
          beskrivelse: "lottKunTrygdeavgift",
          inntektskilde: "A-ordningen",
          inntektsstatus: "LoependeInnrapportert",
          utbetaltIMaaned: "2023-12",
          virksomhet: { aktoerType: "ORGANISASJON", identifikator: "2222222" },
          inntektsmottaker: { aktoerType: "NATURLIG_IDENT", identifikator: "-1" },
          inngaarIGrunnlagForTrekk: null,
          utloeserArbeidsgiveravgift: null,
          informasjonsstatus: null,
          inntektType: null,
          aarMaaned: "2024-11",
          inntektsperiodetype: "maaned",
        },
        {
          belop: "150000.0",
          fordel: "kontantytelse",
          beskrivelse: "lottKunTrygdeavgift",
          inntektskilde: "A-ordningen",
          inntektsstatus: "LoependeInnrapportert",
          utbetaltIMaaned: "2023-12",
          virksomhet: { aktoerType: "ORGANISASJON", identifikator: "2222222" },
          inntektsmottaker: { aktoerType: "NATURLIG_IDENT", identifikator: "-1" },
          inngaarIGrunnlagForTrekk: null,
          utloeserArbeidsgiveravgift: null,
          informasjonsstatus: null,
          inntektType: null,
          aarMaaned: "2024-10",
          inntektsperiodetype: "maaned",
        },
        {
          belop: "150000.0",
          fordel: "kontantytelse",
          beskrivelse: "lottKunTrygdeavgift",
          inntektskilde: "A-ordningen",
          inntektsstatus: "LoependeInnrapportert",
          utbetaltIMaaned: "2023-12",
          virksomhet: { aktoerType: "ORGANISASJON", identifikator: "2222222" },
          inntektsmottaker: { aktoerType: "NATURLIG_IDENT", identifikator: "-1" },
          inngaarIGrunnlagForTrekk: null,
          utloeserArbeidsgiveravgift: null,
          informasjonsstatus: null,
          inntektType: null,
          aarMaaned: "2024-09",
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
