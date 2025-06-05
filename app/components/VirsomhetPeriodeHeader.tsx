import type { IPeriode } from "~/types/inntekt.types";
import { formaterNorskDato } from "~/utils/formattering.util";

interface IProps {
  periodeNummer: number;
  periode: IPeriode;
}

export function VirsomhetPeriodeHeader({ periodeNummer, periode }: IProps) {
  return (
    <div>
      <div>
        <span>Periode {periodeNummer}</span>
        <br />
        <span className="light medium">
          {formaterNorskDato(periode.fraOgMed)} - {formaterNorskDato(periode.tilOgMed)}
        </span>
      </div>
    </div>
  );
}
