import { differenceInMonths, format } from "date-fns";
import { parse } from "date-fns/parse";
import type { IInntekt, IPeriode, IVirksomhet } from "~/types/inntekt.types";

export function sumTotaltInntekterForAlleVirksomheter(virksomheter: IVirksomhet[]): number {
  return virksomheter.reduce(
    (total, virksomhet) =>
      total +
      virksomhet.inntekter.reduce((sum, inntekt) => sum + parseInt(inntekt.belop.toString()), 0),
    0
  );
}

// Returnerer true hvis perioden dekker nøyaktig 36 måneder (inkludert fra- og til-måneden)
export function inntektsPeriodeEr36Maneder(periode: IPeriode): boolean {
  const fraDato = parse(periode.fraOgMed, "yyyy-MM", new Date());
  const tilDato = parse(periode.tilOgMed, "yyyy-MM", new Date());

  const antallManeder = differenceInMonths(tilDato, fraDato) + 1;
  return antallManeder === 36;
}

export interface IVirksomhetInntekt {
  beskrivelse: string;
  inntektskilde: string;
  inntekter: IInntekt[];
}

// Funksjon som grupperer inntekter etter inntektsbeskrivelse
export function grupperEtterInntektsbeskrivelse(inntekter: IInntekt[]): IVirksomhetInntekt[] {
  const grupper: Record<string, IVirksomhetInntekt> = {};

  inntekter.forEach((inntekt) => {
    const key = inntekt.beskrivelse;

    if (!grupper[key]) {
      grupper[key] = {
        beskrivelse: inntekt.beskrivelse,
        inntektskilde: inntekt.inntektskilde,
        inntekter: [],
      };
    }

    grupper[key].inntekter.push(inntekt);
  });

  return Object.values(grupper);
}

// Deler opp inntektsperioden i tre separate perioder, hver på 12 måneder
export function delOppPeriodeTilTrePerioder(inntektsperiode: IPeriode): IPeriode[] {
  const { fraOgMed } = inntektsperiode;

  // Trekker ut startår og startmåned fra "fra"-verdien (f.eks. "2022-01")
  const startAr = parseInt(fraOgMed.split("-")[0], 10);
  const startManed = parseInt(fraOgMed.split("-")[1], 10);

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
      fraOgMed: formatter(fraDato),
      tilOgMed: formatter(tilDato),
    });
  }

  if (perioder.length !== 3) {
    throw new Error("Feil: Periodene er ikke delt opp i tre perioder");
  }

  return perioder.reverse();
}

// Beregner total inntekt for en gitt periode ved å summere beløp innenfor fra–til
export function beregnTotalInntektForEnPeriode(inntekter: IInntekt[], periode: IPeriode): number {
  const { fraOgMed, tilOgMed } = periode;

  // Filtrerer inntektene basert på datoene i perioden
  const filtrerte = inntekter.filter((inntekt) => {
    const dato = inntekt.aarMaaned;
    return dato >= fraOgMed && dato <= tilOgMed;
  });

  // Summerer beløpene for de filtrerte inntektene
  const total = filtrerte.reduce((sum, inntekt) => {
    return sum + parseInt(inntekt.belop.toString(), 10);
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
  const periodeTilYear = parseInt(periode.tilOgMed.slice(0, 4), 10);
  const periodeStartYear = periodeTilYear - 3;

  const perioder: IGenerertePeriode[] = [];

  for (let year = periodeStartYear; year <= periodeTilYear; year++) {
    const manader: IGenerertManed[] = [];

    for (let month = 0; month < 12; month++) {
      const dato = new Date(year, month, 1); // f.eks. 2023-11-01
      const arOgManed = format(dato, "yyyy-MM");

      const readOnly = arOgManed < periode.fraOgMed || arOgManed > periode.tilOgMed;

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

// Summerer inntekter per aarMaaned
export function summerInntekterPerManed(inntekter: IInntekt[]): Record<string, string> {
  return inntekter.reduce(
    (acc, inntekt) => {
      const beløp = parseInt(inntekt.belop, 10);
      const eksisterendeBeløp = acc[inntekt.aarMaaned] ? parseInt(acc[inntekt.aarMaaned], 10) : 0;
      acc[inntekt.aarMaaned] = (eksisterendeBeløp + beløp).toString();
      return acc;
    },
    {} as Record<string, string>
  );
}
