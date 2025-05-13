import { TextField } from "@navikt/ds-react";
import { getYear } from "date-fns";
import { useEffect, useState } from "react";
import { useTypedRouteLoaderData } from "~/hooks/useTypedRouteLoaderData";
import { genererFireArTilOgMed, type IAarManeder } from "~/utils/inntekt.util";
import styles from "./InntektPerioder.module.css";

export function InntektPerioder() {
  const [perioder, setPerioder] = useState<IAarManeder[]>();
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
        <div key={periode.aar} className={styles.periode}>
          <div className="bold">{periode.aar}</div>
          <div className={styles.manederContainer}>
            {periode.maneder.map((maned, _index) => (
              <TextField key={_index} label={maned.maned} size="small" readOnly={maned.readOnly} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
