import { ExpansionCard } from "@navikt/ds-react";
import UtvidetIntektTabell from "~/components/UtvidetInntektTabell";
import type { InntektVirksomhetMaaned } from "~/types/inntekt.types";

function VariableAndAnswer(name: string, value: string) {
  return (
    <div>
      <b>{name}</b>
      <p style={{ marginTop: "0px", marginBottom: "5px" }}>{value}</p>
    </div>
  );
}

interface VirksomhetPeriode {
  fra: Date;
  til: Date;
}

interface Inntekt {
  inntektstype: string;
  kilde: string;
  sistOppdatert: string;
  redigert: string;
  begrunnelse: string;
  b: string;
  beløp: string;
}

interface Virksomhet {
  virksomhetsnummer: string;
  navn: string;
  periode: VirksomhetPeriode;
  inntekter: Inntekt[];
}

interface VirksomhetExpansionProps {
  virksomhet: InntektVirksomhetMaaned;
}

const lesbarPeriode = (periode: VirksomhetPeriode) => {
  const fraMånedOgÅr = `${(periode.fra.getMonth() + 1)
    .toString()
    .padStart(2, "0")}.${periode.fra.getFullYear()}`;
  const tilMånedOgÅr = `${(periode.til.getMonth() + 1)
    .toString()
    .padStart(2, "0")}.${periode.til.getFullYear()}`;

  return `${fraMånedOgÅr} - ${tilMånedOgÅr}`;
};

const beløpForPerioden = (inntekter: Inntekt[]) => {
  return inntekter.reduce((total, inntekt) => {
    const beløp = parseFloat(inntekt.beløp.replace(/\D/g, ""));
    return total + (isNaN(beløp) ? 0 : beløp);
  }, 0);
};

const formaterBeløp = (beløp: number) => {
  return `${beløp.toLocaleString("no-NO")} kr`;
};

export default function InntektExpansionCard({ virksomhet }: VirksomhetExpansionProps) {
  return (
    <ExpansionCard aria-label="Demo med custom styling">
      <ExpansionCard.Header>
        <ExpansionCard.Title>{virksomhet.virksomhetNavn}</ExpansionCard.Title>
        <ExpansionCard.Description>
          Organisasjonsnummer {virksomhet.virksomhet}
          {/* {VariableAndAnswer("Org nummer", virksomhet.virksomhetsnummer)}
          {VariableAndAnswer("Periode", lesbarPeriode(virksomhet.periode))}
          {VariableAndAnswer(
            "Beløp for perioden",
            `${formaterBeløp(beløpForPerioden(virksomhet.inntekter))}`
          )} */}
        </ExpansionCard.Description>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        <UtvidetIntektTabell />
      </ExpansionCard.Content>
    </ExpansionCard>
  );
}
