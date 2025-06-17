import type {
  IInntekt,
  IMottaker,
  IPeriode,
  IUklassifisertInntekt,
  IVirksomhet,
} from "~/types/inntekt.types";

const mottaker: IMottaker = { pnr: "20443502916", navn: "Ola Nordmann" };
const inntektsperiode: IPeriode = { fraOgMed: "2020-12", tilOgMed: "2023-11" };
const kiwiPeriod: IPeriode = { fraOgMed: "2021-01", tilOgMed: "2023-04" };
const privatPersonPeriod: IPeriode = { fraOgMed: "2021-01", tilOgMed: "2022-10" };

const kiwiVirksomhet: IVirksomhet = {
  virksomhetsnummer: "937846231",
  virksomhetsnavn: "KIWI NORGE AS",
  periode: kiwiPeriod,
  inntekter: generateMockInntektDataFromPeriode(kiwiPeriod, "fastloenn"),
  totalBelop: "0",
  avvikListe: [],
};

const privatPerson: IVirksomhet = {
  virksomhetsnummer: "20443502916",
  virksomhetsnavn: "",
  periode: privatPersonPeriod,
  inntekter: generateMockInntektDataFromPeriode(privatPersonPeriod, "lottKunTrygdeavgift"),
  totalBelop: "0",
  avvikListe: [],
};

export const mockUklassifisertInntekt: IUklassifisertInntekt = {
  virksomheter: [kiwiVirksomhet, privatPerson],
  mottaker: mottaker,
  periode: inntektsperiode,
};

updateTotalBelop(mockUklassifisertInntekt.virksomheter);

function generateMockInntektDataFromPeriode(periode: IPeriode, inntektstype: string): IInntekt[] {
  const { fraOgMed, tilOgMed } = periode;

  const [startYear, startMonth] = fraOgMed.split("-").map(Number);
  const [endYear, endMonth] = tilOgMed.split("-").map(Number);

  const data: IInntekt[] = [];
  let year = startYear;
  let month = startMonth;

  while (year < endYear || (year === endYear && month <= endMonth)) {
    const formattedMonth = `${year}-${String(month).padStart(2, "0")}`;

    data.push({
      belop: "10000.0", // this could be any mock value
      fordel: "kontantytelse",
      beskrivelse: inntektstype,
      inntektskilde: "dp-inntekt-frontend",
      inntektsstatus: "LoependeInnrapportert",
      utbetaltIMaaned: formattedMonth,
      virksomhet: { aktoerType: "ORGANISASJON", identifikator: "896929119" },
      inntektsmottaker: { aktoerType: "AKTOER_ID", identifikator: "2044350291600" },
      inngaarIGrunnlagForTrekk: true,
      utloeserArbeidsgiveravgift: true,
      informasjonsstatus: null,
      inntektType: "",
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
