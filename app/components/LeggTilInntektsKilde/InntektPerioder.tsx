import { TextField } from "@navikt/ds-react";

import styles from "./InntektPerioder.module.css";

export function InntektPerioder() {
  return (
    <div className={styles.periodeContainer}>
      {inntekterPropsMockData.map((periode) => (
        <div className={styles.periode}>
          <div className="bold">{periode.ar}</div>
          <div className={styles.manederContainer}>
            {periode.maneder.map((maned) => (
              <TextField label={maned.maned} size="small" value={maned.inntekt} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const inntekterPropsMockData = [
  {
    ar: "2021",
    maneder: [
      { maned: "Januar", inntekt: 10000 },
      { maned: "Februar", inntekt: 12000 },
      { maned: "Mars", inntekt: 11000 },
      { maned: "April", inntekt: 13000 },
      { maned: "Mai", inntekt: 14000 },
      { maned: "Juni", inntekt: 15000 },
      { maned: "Juli", inntekt: 16000 },
      { maned: "August", inntekt: 17000 },
      { maned: "September", inntekt: 18000 },
      { maned: "Oktober", inntekt: 19000 },
      { maned: "November", inntekt: 20000 },
      { maned: "Desember", inntekt: 21000 },
    ],
  },
  {
    ar: "2022",
    maneder: [
      { maned: "Januar", inntekt: 10000 },
      { maned: "Februar", inntekt: 12000 },
      { maned: "Mars", inntekt: 11000 },
      { maned: "April", inntekt: 13000 },
      { maned: "Mai", inntekt: 14000 },
      { maned: "Juni", inntekt: 15000 },
      { maned: "Juli", inntekt: 16000 },
      { maned: "August", inntekt: 17000 },
      { maned: "September", inntekt: 18000 },
      { maned: "Oktober", inntekt: 19000 },
      { maned: "November", inntekt: 20000 },
      { maned: "Desember", inntekt: 21000 },
    ],
  },
  {
    ar: "2023",
    maneder: [
      { maned: "Januar", inntekt: 10000 },
      { maned: "Februar", inntekt: 12000 },
      { maned: "Mars", inntekt: 11000 },
      { maned: "April", inntekt: 13000 },
      { maned: "Mai", inntekt: 14000 },
      { maned: "Juni", inntekt: 15000 },
      { maned: "Juli", inntekt: 16000 },
      { maned: "August", inntekt: 17000 },
      { maned: "September", inntekt: 18000 },
      { maned: "Oktober", inntekt: 19000 },
      { maned: "November", inntekt: 20000 },
      { maned: "Desember", inntekt: 21000 },
    ],
  },
  {
    ar: "2024",
    maneder: [
      { maned: "Januar", inntekt: 10000 },
      { maned: "Februar", inntekt: 12000 },
      { maned: "Mars", inntekt: 11000 },
      { maned: "April", inntekt: 13000 },
      { maned: "Mai", inntekt: 0 },
      { maned: "Juni", inntekt: 0 },
      { maned: "Juli", inntekt: 0 },
      { maned: "August", inntekt: 0 },
      { maned: "September", inntekt: 0 },
      { maned: "Oktober", inntekt: 0 },
      { maned: "November", inntekt: 0 },
      { maned: "Desember", inntekt: 0 },
    ],
  },
];
