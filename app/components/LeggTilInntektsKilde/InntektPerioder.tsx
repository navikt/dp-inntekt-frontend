import { TextField } from "@navikt/ds-react";

import styles from "./InntektPerioder.module.css";
import { useEffect, useState } from "react";
import { getYear } from "date-fns";
import { genererFireArBakFraSluttAr, type IAarManeder } from "~/utils/inntekt.util";

interface IProps {
  periodeSluttAr: number;
  periodeSluttManed: number;
}

export function InntektPerioder({ periodeSluttAr, periodeSluttManed }: IProps) {
  const [perioder, setPerioder] = useState<IAarManeder[]>();

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
        <div key={periode.aar} className={styles.periode}>
          <div className="bold">{periode.aar}</div>
          <div className={styles.manederContainer}>
            {periode.maneder.map((maned, _index) => (
              <TextField key={_index} label={maned.maned} size="small" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
