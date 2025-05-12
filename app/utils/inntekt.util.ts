import type {
  IInntekt,
  IPeriode,
  IUklassifisertInntekt,
  IVirksomhetsinntekt,
} from "~/types/inntekt.types";

export function sumTotalBelopForVirkesomhet(inntekter: IInntekt[]): number {
  return inntekter.reduce((sum, item) => sum + Number(item.belop), 0);
}

export function sumTotalBelopForHelePeriode(virksomhetsinntekter: IVirksomhetsinntekt[]): number {
  return virksomhetsinntekter.reduce((total, virksomhet) => {
    const sumPerVirksomhet = virksomhet.inntekter.reduce((sum, inntekt) => {
      const belop = parseFloat(inntekt.belop);
      return sum + (isNaN(belop) ? 0 : belop);
    }, 0);
    return total + sumPerVirksomhet;
  }, 0);
}

const inntektTypeTekst: Record<string, string> = {
  LOENNSINNTEKT: "Lønnsinntekt",
  NAERINGSINNTEKT: "Næringsinntekt",
  PENSJON_ELLER_TRYGD: "Pensjon eller trygd",
  YTELSE_FRA_OFFENTLIGE: "Ytelse fra offentlige",
};

export function hentInntektTypeTekst(type: string): string {
  return inntektTypeTekst[type] ?? "Ukjent inntektstype";
}

export function summerInntekter(inntekter: IInntekt[]) {
  return inntekter.reduce((sum, inntekt) => {
    const belop = parseFloat(inntekt.belop);
    return sum + (isNaN(belop) ? 0 : belop);
  }, 0);
}

export interface IAarManeder {
  aar: string;
  maneder: IManed[];
}

export interface IManed {
  maned: string;
  inntekt?: number;
}

// Funksjonen lager en liste med fire år (inkludert sluttåret), der hvert år inneholder alle tolv måneder
export function genererFireArBakFraSluttAr(sluttAr: number): IAarManeder[] {
  const norskManeder = [
    "Januar",
    "Februar",
    "Mars",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const perioder: IAarManeder[] = [];

  for (let ar = sluttAr - 3; ar <= sluttAr; ar++) {
    const maneder: IManed[] = norskManeder.map((maned) => ({
      maned,
      inntekt: undefined,
    }));

    perioder.push({ aar: ar.toString(), maneder });
  }

  return perioder;
}

// Funksjonen tar en liste med virksomhetsinntekter og finner den tidligste startdatoen (fra)
// og seneste sluttdatoen (til) blant alle periodene, og returnerer dette som én samlet periode.
export function finnInntekstPeriode(virkersomhetsinntekt: IVirksomhetsinntekt[]): IPeriode {
  if (!Array.isArray(virkersomhetsinntekt) || virkersomhetsinntekt.length === 0) {
    return { fra: "", til: "" };
  }

  let fra = virkersomhetsinntekt[0].periode.fra;
  let til = virkersomhetsinntekt[0].periode.til;

  for (const item of virkersomhetsinntekt) {
    if (item.periode.fra < fra) {
      fra = item.periode.fra;
    }
    if (item.periode.til > til) {
      til = item.periode.til;
    }
  }

  return { fra, til };
}

// Funksjon som grupperer inntekter etter inntektstype og returnerer en array av grupper
// Grupperer inntekter etter både inntektType og inntektKilde, og returnerer en array
export function grupperEtterInntektTypeOgKilde(
  inntekter: IInntekt[]
): { inntektType: string; inntektskilde: string; inntekter: IInntekt[] }[] {
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
    const [inntektType, inntektskilde] = key.split("__");
    return {
      inntektType,
      inntektskilde,
      inntekter,
    };
  });
}

// Funksjon som deler en gitt inntektsperiode inn i tre perioder à 12 måneder
export function delOppIAarperioder(inntektsperiode: IPeriode) {
  const { fra } = inntektsperiode;

  // Trekker ut startår og startmåned fra "fra"-verdien (f.eks. "2022-01")
  const startAar = parseInt(fra.split("-")[0], 10);
  const startMaaned = parseInt(fra.split("-")[1], 10);

  const perioder = [];

  // Går gjennom tre runder for å lage tre perioder, hver på 12 måneder
  for (let i = 0; i < 3; i++) {
    // Starter ny periode ved å legge til 12 måneder per runde
    const fraDato = new Date(startAar, startMaaned - 1 + i * 12);

    // Sluttdato for perioden er 11 måneder etter start
    const tilDato = new Date(fraDato.getFullYear(), fraDato.getMonth() + 11);

    // Funksjon for å formatere datoobjekt til "YYYY-MM" format
    const formatter = (dato: Date) => {
      const aar = dato.getFullYear();
      const maaned = String(dato.getMonth() + 1).padStart(2, "0");
      return `${aar}-${maaned}`;
    };

    // Legger til perioden i resultatlista
    perioder.push({
      fra: formatter(fraDato),
      til: formatter(tilDato),
    });
  }

  return perioder; // Returnerer en liste med tre perioder
}

export function beregnTotalInntektForPeriode(inntekter: IInntekt[], periode: IPeriode): number {
  const { fra, til } = periode;

  // Filtrerer inntekter som ligger innenfor perioden
  const filtrerte = inntekter.filter((inntekt) => {
    const dato = inntekt.aarMaaned;
    return dato >= fra && dato <= til;
  });

  // Summerer beløpene (som strenger) til tall
  const total = filtrerte.reduce((sum, inntekt) => {
    return sum + parseFloat(inntekt.belop);
  }, 0);

  return total;
}
