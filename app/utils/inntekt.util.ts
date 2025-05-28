import { differenceInMonths, format } from "date-fns";
import { parse } from "date-fns/parse";
import type { IInntekt, IPeriode, IVirksomhetsinntekt } from "~/types/inntekt.types";

export function sumTotaltInntekterForAlleVirksomheter(virksomheter: IVirksomhetsinntekt[]): number {
  return virksomheter.reduce(
    (total, virksomhet) =>
      total + virksomhet.inntekter.reduce((sum, inntekt) => sum + inntekt.belop, 0),
    0
  );
}

// Returnerer true hvis perioden dekker nøyaktig 36 måneder (inkludert fra- og til-måneden)
export function inntektsPeriodeEr36Maneder(periode: IPeriode): boolean {
  const fraDato = parse(periode.fra, "yyyy-MM", new Date());
  const tilDato = parse(periode.til, "yyyy-MM", new Date());

  const antallManeder = differenceInMonths(tilDato, fraDato) + 1;
  return antallManeder === 36;
}

// Funksjon som grupperer inntekter etter inntektstype og returnerer en array av grupper
// Grupperer inntekter etter både inntektType og inntektKilde, og returnerer en array
export function grupperEtterInntektType(
  inntekter: IInntekt[]
): { inntektType: string; inntekter: IInntekt[] }[] {
  const grupper = inntekter.reduce((acc: Record<string, IInntekt[]>, inntekt) => {
    const key = `${inntekt.inntektType}__${inntekt.inntektskilde}`; // Kombinert nøkkel

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(inntekt);

    return acc;
  }, {});

  // Konverterer til array med separate felter
  return Object.entries(grupper).map(([key, inntekter]) => {
    const [inntektType] = key.split("__");
    return {
      inntektType,
      inntekter,
    };
  });
}

// Deler opp inntektsperioden i tre separate perioder, hver på 12 måneder
export function delOppPeriodeTilTrePerioder(inntektsperiode: IPeriode): IPeriode[] {
  const { fra } = inntektsperiode;

  // Trekker ut startår og startmåned fra "fra"-verdien (f.eks. "2022-01")
  const startAr = parseInt(fra.split("-")[0], 10);
  const startManed = parseInt(fra.split("-")[1], 10);

  const perioder = [];

  // Går gjennom tre runder for å lage tre perioder, hver på 12 måneder
  for (let i = 0; i < 3; i++) {
    // Starter ny periode ved å legge til 12 måneder per runde
    const fraDato = new Date(startAr, startManed - 1 + i * 12);

    // Sluttdato for perioden er 11 måneder etter start
    const tilDato = new Date(fraDato.getFullYear(), fraDato.getMonth() + 11);

    // Funksjon for å formatere datoobjekt til "YYYY-MM" format
    const formatter = (dato: Date) => {
      const ar = dato.getFullYear();
      const maned = String(dato.getMonth() + 1).padStart(2, "0");
      return `${ar}-${maned}`;
    };

    // Legger til perioden i resultatlista
    perioder.push({
      fra: formatter(fraDato),
      til: formatter(tilDato),
    });
  }

  if (perioder.length !== 3) {
    throw new Error("Feil: Periodene er ikke delt opp i tre perioder");
  }

  return perioder.reverse();
}

// Beregner total inntekt for en gitt periode ved å summere beløp innenfor fra–til
export function beregnTotalInntektForEnPeriode(inntekter: IInntekt[], periode: IPeriode): number {
  const { fra, til } = periode;

  // Filtrerer inntektene basert på datoene i perioden
  const filtrerte = inntekter.filter((inntekt) => {
    const dato = inntekt.aarMaaned;
    return dato >= fra && dato <= til;
  });

  // Summerer beløpene for de filtrerte inntektene
  const total = filtrerte.reduce((sum, inntekt) => {
    return sum + inntekt.belop;
  }, 0);

  return total;
}

export interface IGenerertePeriode {
  ar: string;
  maneder: IGenerertManed[];
}

export interface IGenerertManed {
  dato: string;
  readOnly: boolean;
}

// Genererer 4 perioder basert på en gitt periode
export function generereFirePerioder(periode: IPeriode): IGenerertePeriode[] {
  const periodeTilYear = parseInt(periode.til.slice(0, 4), 10);
  const periodeStartYear = periodeTilYear - 3;

  const perioder: IGenerertePeriode[] = [];

  for (let year = periodeStartYear; year <= periodeTilYear; year++) {
    const manader: IGenerertManed[] = [];

    for (let month = 0; month < 12; month++) {
      const dato = new Date(year, month, 1); // f.eks. 2023-11-01
      const arOgManed = format(dato, "yyyy-MM");

      const readOnly = arOgManed < periode.fra || arOgManed > periode.til;

      manader.push({
        dato: new Date(year, month + 1, 1).toISOString().slice(0, 7),
        readOnly,
      });
    }

    perioder.push({
      ar: year.toString(),
      maneder: manader,
    });
  }

  return perioder;
}
