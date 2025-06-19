import { TrashIcon } from "@navikt/aksel-icons";
import { Button, HStack, Table } from "@navikt/ds-react";
import { useInntekt } from "~/context/inntekt-context";
import type { IUklassifisertInntekt, IVirksomhet } from "~/types/inntekt.types";
import { inntektTyperBeskrivelse } from "~/utils/constants";
import { formatterNorskTall } from "~/utils/formattering.util";
import {
  beregnTotalInntektForEnPeriode,
  delOppPeriodeTilTrePerioder,
  grupperEtterInntektsbeskrivelse,
} from "~/utils/inntekt.util";
import { RedigerVirksomhetInntekt } from "./RedigerVirksomhetInntekt";
import { VirksomhetPeriodeHeader } from "./VirksomhetPeriodeHeader";

interface IProps {
  virksomhet: IVirksomhet;
}

// Denne skal matche valideringen i hentInntektValidationSchema
export interface IRedigeringsData {
  virksomhetsnummer: string;
  beskrivelse: string;
  inntektskilde: string;
}

export default function VirsomhetInntekter({ virksomhet }: IProps) {
  const { uklassifisertInntekt, setUklassifisertInntekt, setInntektEndret } = useInntekt();
  const gruppertinntektsbeskrivelser = grupperEtterInntektsbeskrivelse(virksomhet.inntekter);

  const oppdeltPerioder = delOppPeriodeTilTrePerioder(uklassifisertInntekt.periode);
  const periode1 = oppdeltPerioder[0];
  const periode2 = oppdeltPerioder[1];
  const periode3 = oppdeltPerioder[2];

  function fjernEnInntektBeskrivelfraFraVirksomhet(
    inntektsbeskrivelse: string,
    virksomhetsnummer: string
  ) {
    // Filtrer ut inntekten med den spesifikke inntektsbeskrivelse
    const oppdaterteVirksomhetInntekter = virksomhet.inntekter.filter(
      (inntekt) => inntekt.beskrivelse !== inntektsbeskrivelse
    );

    // Oppdater virksomheten med de filtrerte inntektene
    const oppdaterteVirksomhet: IVirksomhet = {
      ...virksomhet,
      inntekter: oppdaterteVirksomhetInntekter,
    };

    // Filtrer ut den spesifikke virksomheten fra context
    // og oppdater den med den oppdaterte virksomheten
    const oppdaterteVirksomheter = [
      ...uklassifisertInntekt.virksomheter.filter(
        (virksomhet) => virksomhet.virksomhetsnummer !== virksomhetsnummer
      ),
      oppdaterteVirksomhet,
    ];

    // Oppdater hele uklassifisertInntekt med de oppdaterte virksomhetene
    const oppdatertUklassifisertInntekt: IUklassifisertInntekt = {
      ...uklassifisertInntekt,
      virksomheter: oppdaterteVirksomheter,
    };

    setUklassifisertInntekt(oppdatertUklassifisertInntekt);
    setInntektEndret(true);
  }

  function fjernHeleVirksomhet(virksomhetsnummer: string) {
    // Filtrer ut den spesifikke virksomheten fra uklassifisertInntekt
    var oppdatertVirksomheter = uklassifisertInntekt.virksomheter.filter(
      (virksomhet) => virksomhet.virksomhetsnummer !== virksomhetsnummer
    );

    // Oppdater hele uklassifisertInntekt med de oppdaterte virksomhetene
    // Dette vil fjerne hele virksomheten fra listen
    setUklassifisertInntekt({
      ...uklassifisertInntekt,
      virksomheter: oppdatertVirksomheter,
    });

    setInntektEndret(true);
  }

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell scope="col">Inntektstype</Table.HeaderCell>
          <Table.HeaderCell scope="col">Kilde</Table.HeaderCell>
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
        {gruppertinntektsbeskrivelser.map((virksomhetInntekt) => (
          <Table.Row key={virksomhetInntekt.beskrivelse}>
            <Table.DataCell>
              {inntektTyperBeskrivelse.find((type) => type.key === virksomhetInntekt.beskrivelse)
                ?.text || virksomhetInntekt.beskrivelse}
            </Table.DataCell>
            <Table.DataCell>{virksomhetInntekt.inntektskilde}</Table.DataCell>
            <Table.DataCell align="right">
              {formatterNorskTall(
                beregnTotalInntektForEnPeriode(virksomhetInntekt.inntekter, periode1)
              )}
            </Table.DataCell>
            <Table.DataCell align="right">
              {formatterNorskTall(
                beregnTotalInntektForEnPeriode(virksomhetInntekt.inntekter, periode2)
              )}
            </Table.DataCell>
            <Table.DataCell align="right">
              {formatterNorskTall(
                beregnTotalInntektForEnPeriode(virksomhetInntekt.inntekter, periode3)
              )}
            </Table.DataCell>
            <Table.DataCell align="right">
              <HStack gap="1" justify="end">
                <RedigerVirksomhetInntekt
                  virksomhet={virksomhet}
                  formDefaultValues={{
                    beskrivelse: virksomhetInntekt.beskrivelse,
                    inntektskilde: virksomhetInntekt.inntektskilde,
                    inntekter: virksomhetInntekt.inntekter,
                  }}
                />
                <Button
                  variant="tertiary"
                  size="small"
                  icon={<TrashIcon />}
                  onClick={() =>
                    gruppertinntektsbeskrivelser.length === 1
                      ? fjernHeleVirksomhet(virksomhet.virksomhetsnummer)
                      : fjernEnInntektBeskrivelfraFraVirksomhet(
                          virksomhetInntekt.beskrivelse,
                          virksomhet.virksomhetsnummer
                        )
                  }
                />
              </HStack>
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
