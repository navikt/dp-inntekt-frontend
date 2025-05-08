export const mockUklassifisertInntekt: IUklassifisertInntekt = {
  inntektVirksomhetMaaned: [
    {
      virksomhet: "896929119",
      virksomhetNavn: "Kiwi",
      periode: { fra: "2021-01", til: "2023-12" },
      inntekter: generateMockInntektDataFromRange("2021-01", "2023-12"),
      totalBeløp: "200000",
      avvikListe: [],
    },
    {
      virksomhet: "896929120",
      virksomhetNavn: "Meny",
      periode: { fra: "2023-01", til: "2023-12" },
      inntekter: [
        {
          belop: "50000",
          fordel: "kontantytelse",
          beskrivelse: "fastloenn",
          inntektsKilde: "A-ordningen",
          inntektsStatus: "LoependeInnrapportert",
          opptjeningsland: "NO",
          skattemessigBosattLand: "NO",
          utbetaltIMaaned: "2023-01",
          virksomhet: { aktoerType: "ORGANISASJON", identifikator: "896929120" },
          inntektsmottaker: { aktoerType: "AKTOER_ID", identifikator: "2044350291600" },
          inngaarIGrunnlagForTrekk: true,
          utloeserArbeidsgiveravgift: true,
          informasjonsstatus: "InngaarAlltid",
          inntektType: "LOENNSINNTEKT",
          tilleggsinformasjon: { kategori: "NorskKontinentalsokkel" },
          redigert: false,
          begrunnelse: "FASTLOENN",
          aarMaaned: "2023-01",
        },
      ],
      totalBeløp: "50000",
      avvikListe: [],
    },
  ],
  mottaker: { pnr: "20443502916", navn: "Ola Nordmann" },
  // Todo finn ut om intekstId utleder hvilke inteksperiode dette gjelder, det er for deler i tre perioder
  inntektsperiod: { fra: "2021-01", til: "2023-12" },
};

import type { IUklassifisertInntekt } from "~/types/inntekt.types";

function generateMockInntektDataFromRange(start: string, end: string) {
  const [startYear, startMonth] = start.split("-").map(Number);
  const [endYear, endMonth] = end.split("-").map(Number);

  const data = [];
  let year = startYear;
  let month = startMonth;

  while (year < endYear || (year === endYear && month <= endMonth)) {
    const formattedMonth = `${year}-${String(month).padStart(2, "0")}`;

    data.push({
      belop: "10000",
      fordel: "kontantytelse",
      beskrivelse: "fastloenn",
      inntektsKilde: "A-ordningen",
      inntektsStatus: "LoependeInnrapportert",
      opptjeningsland: "NO",
      skattemessigBosattLand: "NO",
      utbetaltIMaaned: formattedMonth,
      virksomhet: { aktoerType: "ORGANISASJON", identifikator: "896929119" },
      inntektsmottaker: { aktoerType: "AKTOER_ID", identifikator: "2044350291600" },
      inngaarIGrunnlagForTrekk: true,
      utloeserArbeidsgiveravgift: true,
      informasjonsstatus: "InngaarAlltid",
      inntektType: "LOENNSINNTEKT",
      tilleggsinformasjon: { kategori: "NorskKontinentalsokkel" },
      redigert: false,
      begrunnelse: "FASTLOENN",
      aarMaaned: formattedMonth,
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
