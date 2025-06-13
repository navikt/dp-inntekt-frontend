import { NotePencilIcon, TrashIcon } from "@navikt/aksel-icons";
import { Button, HStack, Table } from "@navikt/ds-react";
import { useEffect, useRef, useState } from "react";
import { useInntekt } from "~/context/inntekt-context";
import type { IUklassifisertInntekt, IVirksomhet } from "~/types/inntekt.types";
import { inntektTyperBeskrivelse } from "~/utils/constants";
import { formatterNorskTall } from "~/utils/formattering.util";
import {
  beregnTotalInntektForEnPeriode,
  delOppPeriodeTilTrePerioder,
  grupperEtterInntektType,
} from "~/utils/inntekt.util";
import RedigerModal, { type IRedigeringsData } from "./LeggTilInntektsKilde/RedigerModal";
import { VirksomhetPeriodeHeader } from "./VirksomhetPeriodeHeader";
import { erPersonnummer } from "~/utils/generell.util";

interface IProps {
  virksomhet: IVirksomhet;
}

export default function VirsomhetInntekter({ virksomhet }: IProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const [endring, setEndring] = useState<IRedigeringsData | undefined>(undefined);
  const { uklassifisertInntekt, setUklassifisertInntekt, setInntektEndret } = useInntekt();

  const erPrivatPerson = erPersonnummer(virksomhet.virksomhetsnummer);
  const gruppertinntektTyperBeskrivelse = grupperEtterInntektType(virksomhet.inntekter);
  const oppdeltPerioder = delOppPeriodeTilTrePerioder(uklassifisertInntekt.periode);
  const periode1 = oppdeltPerioder[0];
  const periode2 = oppdeltPerioder[1];
  const periode3 = oppdeltPerioder[2];

  useEffect(() => {
    if (endring) {
      ref.current?.showModal();
    }
  }, [endring]);

  function fjernInntekt(inntektType: string) {
    const oppdatertInntektForGittVirksomhet = virksomhet.inntekter.filter(
      (inntekt) => inntekt.inntektType !== inntektType
    );

    const oppdatertVirksomhet: IVirksomhet = {
      ...virksomhet,
      inntekter: oppdatertInntektForGittVirksomhet,
    };

    const oppdatertVirksomheter = [
      ...uklassifisertInntekt.virksomheter.filter(
        (v) => v.virksomhetsnummer !== virksomhet.virksomhetsnummer
      ),
      oppdatertVirksomhet,
    ];

    const oppdatertUklassifisertInntekt: IUklassifisertInntekt = {
      ...uklassifisertInntekt,
      virksomheter: oppdatertVirksomheter,
    };

    setUklassifisertInntekt(oppdatertUklassifisertInntekt);
    setInntektEndret(true);
  }

  function slettVirksomhet() {
    var oppdatertKontekstVirksomheter = uklassifisertInntekt.virksomheter.filter(
      (v) => virksomhet.virksomhetsnummer !== v.virksomhetsnummer
    );

    setUklassifisertInntekt({
      ...uklassifisertInntekt,
      virksomheter: oppdatertKontekstVirksomheter,
    });

    setInntektEndret(true);
  }

  return (
    <>
      {endring && <RedigerModal ref={ref} redigeringsData={endring} />}

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
          {gruppertinntektTyperBeskrivelse.map((inntekt) => (
            <Table.Row key={inntekt.inntektsbeskrivelse}>
              <Table.DataCell>
                {inntektTyperBeskrivelse.find((type) => type.key === inntekt.inntektsbeskrivelse)
                  ?.text || inntekt.inntektsbeskrivelse}
              </Table.DataCell>
              <Table.DataCell>{inntekt.inntektsbeskrivelse}</Table.DataCell>
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
                <HStack gap="1" justify="end">
                  <Button
                    variant="tertiary"
                    size="small"
                    icon={<NotePencilIcon />}
                    onClick={() => {
                      setEndring({
                        virksomhetsnummer: virksomhet.virksomhetsnummer,
                        inntektstype: inntekt.inntektsbeskrivelse,
                        inntektskilde: erPrivatPerson ? "NATURLIG_IDENT" : "ORGANISASJON",
                        inntekter: inntekt.inntekter,
                      });

                      ref.current?.showModal();
                    }}
                  />
                  <Button
                    variant="tertiary"
                    size="small"
                    icon={<TrashIcon />}
                    onClick={() =>
                      gruppertinntektTyperBeskrivelse.length > 1
                        ? fjernInntekt(inntekt.inntektsbeskrivelse)
                        : slettVirksomhet()
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
    </>
  );
}
