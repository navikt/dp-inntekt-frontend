import { TextField } from "@navikt/ds-react";
import { format, getYear } from "date-fns";
import { useEffect, useState } from "react";
import { useTypedRouteLoaderData } from "~/hooks/useTypedRouteLoaderData";
import { genererFireArTilOgMed, type IGenerertePeriode } from "~/utils/inntekt.util";
import styles from "./InntektPerioder.module.css";
import { nb } from "date-fns/locale/nb";
import { capitalize } from "~/utils/generell.util";

export function InntektPerioder() {
  const [perioder, setPerioder] = useState<IGenerertePeriode[]>();
  const { uklassifisertInntekt } = useTypedRouteLoaderData("routes/_index");

  useEffect(() => {
    lagPerioder();
  }, []);

  // @ts-ignore
  const periode = uklassifisertInntekt.data.periode;

  function lagPerioder() {
    const generertPerioder = genererFireArTilOgMed(periode);
    setPerioder(generertPerioder);
  }

  return (
    <div className={styles.periodeContainer}>
      {perioder?.map((periode) => (
        <div key={periode.ar} className={styles.periode}>
          <div className="bold">{periode.ar}</div>
          <div className={styles.manederContainer}>
            {periode.maneder.map((month) => (
              <TextField
                key={month.dato}
                name={month.dato}
                label={capitalize(format(month.dato, "MMMM", { locale: nb }))}
                size="small"
                readOnly={month.readOnly}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
