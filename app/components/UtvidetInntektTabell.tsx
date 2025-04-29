import { Button, Table } from "@navikt/ds-react";
import type { IInntektVirksomhetMaaned } from "~/types/inntekt.types";
import { formatterNorskTall } from "~/utils/formattering.util";

interface IProps {
  inntektVirksomhetMaaned: IInntektVirksomhetMaaned;
}

export default function UtvidetIntektTabell({ inntektVirksomhetMaaned }: IProps) {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell scope="col">Inntektstype</Table.HeaderCell>
          <Table.HeaderCell scope="col">Kilde</Table.HeaderCell>
          <Table.HeaderCell scope="col">Redigert</Table.HeaderCell>
          <Table.HeaderCell scope="col">Begrunnelse</Table.HeaderCell>
          <Table.HeaderCell scope="col" align="right">
            Beløp
          </Table.HeaderCell>
          <Table.HeaderCell scope="col"></Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {inntektVirksomhetMaaned.inntekter.map((inntekt) => {
          return (
            <Table.Row>
              <Table.DataCell>{inntekt.inntektType}</Table.DataCell>
              <Table.DataCell>{inntekt.inntektsKilde}</Table.DataCell>
              <Table.DataCell>{inntekt.redigert ? "Ja" : "Nei"}</Table.DataCell>
              <Table.DataCell>{inntekt.begrunnelse}</Table.DataCell>
              <Table.DataCell align="right">
                {formatterNorskTall(Number(inntekt.belop))}
              </Table.DataCell>
              <Table.DataCell align="right">
                <Button variant="tertiary" size="small">
                  Rediger
                </Button>
              </Table.DataCell>
            </Table.Row>
          );
        })}

        <Table.Row>
          <Table.DataCell className="bold">Totalt</Table.DataCell>
          <Table.DataCell></Table.DataCell>
          <Table.DataCell></Table.DataCell>
          <Table.DataCell></Table.DataCell>
          <Table.DataCell className="bold" align="right">
            {formatterNorskTall(Number(inntektVirksomhetMaaned.totalBeløp))}
          </Table.DataCell>
          <Table.DataCell></Table.DataCell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
}
