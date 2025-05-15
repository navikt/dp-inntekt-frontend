import { TextField } from "@navikt/ds-react";
import { format } from "date-fns";
import { nb } from "date-fns/locale/nb";
import { capitalize } from "~/utils/generell.util";
import { type IGenerertePeriode } from "~/utils/inntekt.util";
import styles from "./InntektPerioder.module.css";

interface IProps {
  perioder: IGenerertePeriode[];
  form: any;
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
                key={month.dato}
                name={month.dato}
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
