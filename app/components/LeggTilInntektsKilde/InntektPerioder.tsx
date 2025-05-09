import { TextField } from "@navikt/ds-react";

import styles from "./InntektPerioder.module.css";
import { useEffect, useState } from "react";
import { getYear } from "date-fns";

interface IProps {
  periodeSlutt: number | undefined;
}

interface IPeriod {
  aar: string;
  maneder: IManed[];
}

interface IManed {
  maned: string;
  inntekt: number;
}

export function InntektPerioder({ periodeSlutt }: IProps) {
  const [perioder, setPerioder] = useState<IPeriod[]>();

  useEffect(() => {
    lagPerioder();
  }, [periodeSlutt]);

  function lagPerioder() {
    const year = getYear(new Date());
    const generertPerioder = generateFourYearsBackFromEnd(periodeSlutt || year);
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

function generateFourYearsBackFromEnd(endYear: number): IPeriod[] {
  const norwegianMonths = [
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

  const periods: IPeriod[] = [];

  for (let year = endYear - 3; year <= endYear; year++) {
    const maneder: IManed[] = norwegianMonths.map((maned) => ({
      maned,
      inntekt: 0,
    }));

    periods.push({ aar: year.toString(), maneder });
  }

  return periods;
}

// const inntekterPropsMockData = [
//   {
//     ar: "2021",
//     maneder: [
//       { maned: "Januar", inntekt: 10000 },
//       { maned: "Februar", inntekt: 12000 },
//       { maned: "Mars", inntekt: 11000 },
//       { maned: "April", inntekt: 13000 },
//       { maned: "Mai", inntekt: 14000 },
//       { maned: "Juni", inntekt: 15000 },
//       { maned: "Juli", inntekt: 16000 },
//       { maned: "August", inntekt: 17000 },
//       { maned: "September", inntekt: 18000 },
//       { maned: "Oktober", inntekt: 19000 },
//       { maned: "November", inntekt: 20000 },
//       { maned: "Desember", inntekt: 21000 },
//     ],
//   },
//   {
//     ar: "2022",
//     maneder: [
//       { maned: "Januar", inntekt: 10000 },
//       { maned: "Februar", inntekt: 12000 },
//       { maned: "Mars", inntekt: 11000 },
//       { maned: "April", inntekt: 13000 },
//       { maned: "Mai", inntekt: 14000 },
//       { maned: "Juni", inntekt: 15000 },
//       { maned: "Juli", inntekt: 16000 },
//       { maned: "August", inntekt: 17000 },
//       { maned: "September", inntekt: 18000 },
//       { maned: "Oktober", inntekt: 19000 },
//       { maned: "November", inntekt: 20000 },
//       { maned: "Desember", inntekt: 21000 },
//     ],
//   },
//   {
//     ar: "2023",
//     maneder: [
//       { maned: "Januar", inntekt: 10000 },
//       { maned: "Februar", inntekt: 12000 },
//       { maned: "Mars", inntekt: 11000 },
//       { maned: "April", inntekt: 13000 },
//       { maned: "Mai", inntekt: 14000 },
//       { maned: "Juni", inntekt: 15000 },
//       { maned: "Juli", inntekt: 16000 },
//       { maned: "August", inntekt: 17000 },
//       { maned: "September", inntekt: 18000 },
//       { maned: "Oktober", inntekt: 19000 },
//       { maned: "November", inntekt: 20000 },
//       { maned: "Desember", inntekt: 21000 },
//     ],
//   },
//   {
//     ar: "2024",
//     maneder: [
//       { maned: "Januar", inntekt: 10000 },
//       { maned: "Februar", inntekt: 12000 },
//       { maned: "Mars", inntekt: 11000 },
//       { maned: "April", inntekt: 13000 },
//       { maned: "Mai", inntekt: 0 },
//       { maned: "Juni", inntekt: 0 },
//       { maned: "Juli", inntekt: 0 },
//       { maned: "August", inntekt: 0 },
//       { maned: "September", inntekt: 0 },
//       { maned: "Oktober", inntekt: 0 },
//       { maned: "November", inntekt: 0 },
//       { maned: "Desember", inntekt: 0 },
//     ],
//   },
// ];
