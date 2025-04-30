import type { IInntekt, IPeriode } from "~/types/inntekt.types";

// Funksjon som grupperer inntekter etter inntektstype og returnerer en array av grupper
// Grupperer inntekter etter både inntektType og inntektKilde, og returnerer en array
export function grupperEtterInntektTypeOgKilde(
  inntekter: IInntekt[]
): { inntektType: string; inntektsKilde: string; inntekter: IInntekt[] }[] {
  const grupper = inntekter.reduce((acc: Record<string, IInntekt[]>, inntekt) => {
    const key = `${inntekt.inntektType}__${inntekt.inntektsKilde}`; // Kombinert nøkkel

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(inntekt);

    return acc;
  }, {});

  // Konverterer til array med separate felter
  return Object.entries(grupper).map(([key, inntekter]) => {
    const [inntektType, inntektsKilde] = key.split("__");
    return {
      inntektType,
      inntektsKilde,
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

export function filtrertOgSummertBelop(inntekter: IInntekt[], periode: IPeriode): number {
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
