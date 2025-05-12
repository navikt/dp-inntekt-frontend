import { TextField } from "@navikt/ds-react";

import styles from "./InntektPerioder.module.css";
import { useEffect, useState } from "react";
import { getYear } from "date-fns";
import { genererFireArBakFraSluttAr, type IPeriod } from "~/utils/inntekt.util";

interface IProps {
  periodeSluttAr: number | undefined;
}

export function InntektPerioder({ periodeSluttAr }: IProps) {
  const [perioder, setPerioder] = useState<IPeriod[]>();

  useEffect(() => {
    lagPerioder();
  }, [periodeSluttAr]);

  function lagPerioder() {
    const iAr = getYear(new Date());
    const generertPerioder = genererFireArBakFraSluttAr(periodeSluttAr || iAr);
    setPerioder(generertPerioder);
  }

  return (
    <div className={styles.periodeContainer}>
      {perioder?.map((periode) => (
        <div className={styles.periode}>
          <div className="bold">{periode.aar}</div>
          <div className={styles.manederContainer}>
            {periode.maneder.map((maned) => (
              <TextField label={maned.maned} size="small" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
