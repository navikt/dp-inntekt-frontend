import { Button, Table } from "@navikt/ds-react";
import { useRouteLoaderData } from "react-router";
import type { loader } from "~/routes/_index";
import type { IPeriode, IVirksomhetsinntekt } from "~/types/inntekt.types";
import { formatterNorskTall } from "~/utils/formattering.util";
import {
  delOppIAarperioder,
  beregnTotalInntektForPeriode,
  grupperEtterInntektTypeOgKilde,
  hentInntektTypeTekst,
} from "~/utils/inntekt.util";

interface IProps {
  virksomhetsinntekt: IVirksomhetsinntekt;
  inntektsPeriode: IPeriode;
}

export default function UtvidetIntektTabell({ virksomhetsinntekt, inntektsPeriode }: IProps) {
  const gruppertInntektTyper = grupperEtterInntektTypeOgKilde(virksomhetsinntekt.inntekter);
  const indexRouteData = useRouteLoaderData<typeof loader>("routes/_index");

  if (indexRouteData?.uklassifisertInntekt.status === "error") {
    return <>Error</>;
  }

  const oppdeltPeriode = delOppIAarperioder(inntektsPeriode);

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell scope="col">Inntektstype</Table.HeaderCell>
          <Table.HeaderCell scope="col">Kilde</Table.HeaderCell>
          <Table.HeaderCell scope="col" align="right">
            Periode 1
          </Table.HeaderCell>
          <Table.HeaderCell scope="col" align="right">
            Periode 2
          </Table.HeaderCell>
          <Table.HeaderCell scope="col" align="right">
            Periode 3
          </Table.HeaderCell>
          <Table.HeaderCell scope="col"></Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {gruppertInntektTyper.map((inntekt) => (
          <Table.Row key={inntekt.inntektskilde}>
            <Table.DataCell>{hentInntektTypeTekst(inntekt.inntektType)}</Table.DataCell>
            <Table.DataCell>{inntekt.inntektType}</Table.DataCell>
            <Table.DataCell align="right">
              {formatterNorskTall(
                beregnTotalInntektForPeriode(inntekt.inntekter, oppdeltPeriode[0])
              )}
            </Table.DataCell>
            <Table.DataCell align="right">
              {formatterNorskTall(
                beregnTotalInntektForPeriode(inntekt.inntekter, oppdeltPeriode[1])
              )}
            </Table.DataCell>
            <Table.DataCell align="right">
              {formatterNorskTall(
                beregnTotalInntektForPeriode(inntekt.inntekter, oppdeltPeriode[2])
              )}
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
            {formatterNorskTall(
              beregnTotalInntektForPeriode(virksomhetsinntekt.inntekter, oppdeltPeriode[0])
            )}
          </Table.DataCell>
          <Table.DataCell className="bold" align="right">
            {formatterNorskTall(
              beregnTotalInntektForPeriode(virksomhetsinntekt.inntekter, oppdeltPeriode[1])
            )}
          </Table.DataCell>
          <Table.DataCell className="bold" align="right">
            {formatterNorskTall(
              beregnTotalInntektForPeriode(virksomhetsinntekt.inntekter, oppdeltPeriode[2])
            )}
          </Table.DataCell>
          <Table.DataCell></Table.DataCell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
}
