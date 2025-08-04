import { BodyShort, Box, Table, VStack } from "@navikt/ds-react";
import { useInntekt } from "~/context/inntekt-context";
import {formaterNorskDato, formatterNorskTall } from "~/utils/formattering.util";
import {
  beregnTotalInntektForEnPeriode,
  delOppPeriodeTilTrePerioder,
  sumTotaltInntekterForAlleVirksomheter,
} from "~/utils/inntekt.util";
import { VirksomhetPeriodeHeader } from "./VirksomhetPeriodeHeader";
import type { IVirksomhet } from "~/types/inntekt.types";
import { erPersonnummer, maskerePersonnummer } from "~/utils/generell.util";

export function InntektPerioderOppsummering() {
  const { uklassifisertInntekt } = useInntekt();
  const inntektPerioderTotaltBelop = sumTotaltInntekterForAlleVirksomheter(
    uklassifisertInntekt.virksomheter
  );

  const oppdeltPerioder = delOppPeriodeTilTrePerioder(uklassifisertInntekt.periode);
  const periode1 = oppdeltPerioder[0];
  const periode2 = oppdeltPerioder[1];
  const periode3 = oppdeltPerioder[2];

  const alleInntekter = uklassifisertInntekt.virksomheter.flatMap(
    (virksomhet) => virksomhet.inntekter
  );

  function hentVirksomhetNavn(virksomhet: IVirksomhet) {
    if (erPersonnummer(virksomhet.virksomhetsnummer)) {
      return maskerePersonnummer(virksomhet.virksomhetsnummer);
    }

    return virksomhet.virksomhetsnavn || virksomhet.virksomhetsnummer;
  }

  return (
    <Box padding="2">
      <VStack>
        <BodyShort weight="semibold">Inntektsperiode</BodyShort>
        <BodyShort spacing>
          {formaterNorskDato(uklassifisertInntekt.periode.fraOgMed)} -{" "}
          {formaterNorskDato(uklassifisertInntekt.periode.tilOgMed)}
        </BodyShort>
        <BodyShort weight="semibold" size="large">
          {formatterNorskTall(inntektPerioderTotaltBelop)}
        </BodyShort>
      </VStack>

      <div>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell scope="col">Inntektskilde</Table.HeaderCell>
              <Table.HeaderCell scope="col" align="right">
                <VirksomhetPeriodeHeader periodeNummer={1} periode={periode1} />
              </Table.HeaderCell>
              <Table.HeaderCell scope="col" align="right">
                <VirksomhetPeriodeHeader periodeNummer={2} periode={periode2} />
              </Table.HeaderCell>
              <Table.HeaderCell scope="col" align="right">
                <VirksomhetPeriodeHeader periodeNummer={3} periode={periode3} />
              </Table.HeaderCell>
              <Table.HeaderCell scope="col"></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {uklassifisertInntekt.virksomheter.map((virsomhet) => (
              <Table.Row key={virsomhet.virksomhetsnavn}>
                <Table.DataCell>{hentVirksomhetNavn(virsomhet)}</Table.DataCell>
                <Table.DataCell align="right">
                  {formatterNorskTall(
                    beregnTotalInntektForEnPeriode(virsomhet.inntekter, periode1)
                  )}
                </Table.DataCell>
                <Table.DataCell align="right">
                  {formatterNorskTall(
                    beregnTotalInntektForEnPeriode(virsomhet.inntekter, periode2)
                  )}
                </Table.DataCell>
                <Table.DataCell align="right">
                  {formatterNorskTall(
                    beregnTotalInntektForEnPeriode(virsomhet.inntekter, periode3)
                  )}
                </Table.DataCell>
              </Table.Row>
            ))}
            <Table.Row>
              <Table.DataCell className="bold">Totalt</Table.DataCell>
              <Table.DataCell className="bold" align="right">
                {formatterNorskTall(beregnTotalInntektForEnPeriode(alleInntekter, periode1))}
              </Table.DataCell>
              <Table.DataCell className="bold" align="right">
                {formatterNorskTall(beregnTotalInntektForEnPeriode(alleInntekter, periode2))}
              </Table.DataCell>
              <Table.DataCell className="bold" align="right">
                {formatterNorskTall(beregnTotalInntektForEnPeriode(alleInntekter, periode3))}
              </Table.DataCell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    </Box>
  );
}
