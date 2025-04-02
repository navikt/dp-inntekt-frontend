import {Button, Table} from "@navikt/ds-react";


export default function UtvidetIntektTabell() {
    const data = [
        {
            "inntektstype": "Timelønn",
            "kilde": "A-Inntekt",
            "sistOppdatert": "00.00.0000",
            "redigert": "Nei",
            "begrunnelse": "-",
            "b": "-",
            "beløp": "184 500kr",
        }, {
            "inntektstype": "Elektronisk kommunikasjon",
            "kilde": "A-Inntekt",
            "sistOppdatert": "00.00.0000",
            "redigert": "Nei",
            "begrunnelse": "-",
            "b": "-",
            "beløp": "1 400kr",
        }
    ]

    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Inntektstype</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Kilde</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Sist oppdatert</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Redigert</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Begrunnelse</Table.HeaderCell>
                    <Table.HeaderCell scope="col">-</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Beløp</Table.HeaderCell>
                    <Table.HeaderCell scope="col"></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {data.map(it => {
                    return (
                        <Table.Row>
                            <Table.DataCell scope="row">{it.inntektstype}</Table.DataCell>
                            <Table.DataCell>{it.kilde}</Table.DataCell>
                            <Table.DataCell>{it.sistOppdatert}</Table.DataCell>
                            <Table.DataCell>{it.redigert}</Table.DataCell>
                            <Table.DataCell>{it.begrunnelse}</Table.DataCell>
                            <Table.DataCell>{it.b}</Table.DataCell>
                            <Table.DataCell>{it.beløp}</Table.DataCell>
                            <Table.DataCell>
                                <Button variant="tertiary" size="small">
                                    Rediger
                                </Button></Table.DataCell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table>
    )
}