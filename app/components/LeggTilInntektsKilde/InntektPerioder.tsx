import { TextField } from "@navikt/ds-react";
import { format } from "date-fns";
import { nb } from "date-fns/locale/nb";
import { capitalize } from "~/utils/generell.util";
import { type IGenerertePeriode } from "~/utils/inntekt.util";
import styles from "./InntektPerioder.module.css";
import type { FormApi } from "@rvf/react-router";

interface IProps {
  perioder: IGenerertePeriode[];
  form: FormApi<{
    [x: string]: string | undefined;
  }>;
}

export function InntektPerioder({ perioder, form }: IProps) {
  return (
    <div className={styles.periodeContainer}>
      {perioder?.map((periode) => (
        <div key={periode.ar} className={styles.periode}>
          <div className="bold">{periode.ar}</div>
          <div className={styles.manederContainer}>
            {periode.maneder.map((month) => (
              <TextField
                name={month.dato}
                className={styles.maaned}
                key={month.dato}
                label={capitalize(format(month.dato, "MMMM", { locale: nb }))}
                size="small"
                readOnly={month.readOnly}
                error={form.error(month.dato)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
