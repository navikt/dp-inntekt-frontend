import { Button, Table } from "@navikt/ds-react";
import type { IPeriode, IVirksomhet } from "~/types/inntekt.types";
import { inntektTyperBeskrivelse } from "~/utils/constants";
import { formatterNorskTall } from "~/utils/formattering.util";
import {
  beregnTotalInntektForEnPeriode,
  delOppPeriodeTilTrePerioder,
  grupperEtterInntektType,
} from "~/utils/inntekt.util";
import { VirsomhetPeriodeHeader } from "./VirsomhetPeriodeHeader";

interface IProps {
  virksomhet: IVirksomhet;
  inntektsPeriode: IPeriode;
}

export default function VirsomhetInntekter({ virksomhet, inntektsPeriode }: IProps) {
  const gruppertinntektTyperBeskrivelse = grupperEtterInntektType(virksomhet.inntekter);
  const oppdeltPerioder = delOppPeriodeTilTrePerioder(inntektsPeriode);
  const periode1 = oppdeltPerioder[0];
  const periode2 = oppdeltPerioder[1];
  const periode3 = oppdeltPerioder[2];

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell scope="col">Inntektstype</Table.HeaderCell>
          <Table.HeaderCell scope="col">Kilde</Table.HeaderCell>
          <Table.HeaderCell scope="col" align="right">
            <VirsomhetPeriodeHeader periodeNummer={1} periode={periode1} />
          </Table.HeaderCell>
          <Table.HeaderCell scope="col" align="right">
            <VirsomhetPeriodeHeader periodeNummer={2} periode={periode2} />
          </Table.HeaderCell>
          <Table.HeaderCell scope="col" align="right">
            <VirsomhetPeriodeHeader periodeNummer={3} periode={periode3} />
          </Table.HeaderCell>
          <Table.HeaderCell scope="col"></Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {gruppertinntektTyperBeskrivelse.map((inntekt) => (
          <Table.Row key={inntekt.inntektType}>
            <Table.DataCell>
              {inntektTyperBeskrivelse.find((type) => type.key === inntekt.inntektType)?.text ||
                inntekt.inntektType}
            </Table.DataCell>
            <Table.DataCell>{inntekt.inntektType}</Table.DataCell>
            <Table.DataCell align="right">
              {formatterNorskTall(beregnTotalInntektForEnPeriode(inntekt.inntekter, periode1))}
            </Table.DataCell>
            <Table.DataCell align="right">
              {formatterNorskTall(beregnTotalInntektForEnPeriode(inntekt.inntekter, periode2))}
            </Table.DataCell>
            <Table.DataCell align="right">
              {formatterNorskTall(beregnTotalInntektForEnPeriode(inntekt.inntekter, periode3))}
            </Table.DataCell>
            <Table.DataCell align="right">
              <Button variant="tertiary" size="small">
                Rediger
              </Button>
            </Table.DataCell>
          </Table.Row>
        ))}

        <Table.Row>
          <Table.DataCell className="bold">Totalt</Table.DataCell>
          <Table.DataCell className="bold"></Table.DataCell>
          <Table.DataCell className="bold" align="right">
            {formatterNorskTall(beregnTotalInntektForEnPeriode(virksomhet.inntekter, periode1))}
          </Table.DataCell>
          <Table.DataCell className="bold" align="right">
            {formatterNorskTall(beregnTotalInntektForEnPeriode(virksomhet.inntekter, periode2))}
          </Table.DataCell>
          <Table.DataCell className="bold" align="right">
            {formatterNorskTall(beregnTotalInntektForEnPeriode(virksomhet.inntekter, periode3))}
          </Table.DataCell>
          <Table.DataCell></Table.DataCell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
}
