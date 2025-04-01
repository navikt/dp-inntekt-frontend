import {Box, Button, ExpansionCard, Table} from "@navikt/ds-react";
import {mockResponseForHentingAvUklassifisertInntekt} from "~/utils/mock.server.response";
import {PlusCircleIcon} from "@navikt/aksel-icons";
import LeggTilInntektsKildeModal from "~/components/LeggTilInntektskildeModal";

function VariableAndAnswer(name: string, value: string) {
    return (
        <div>
            <b>{name}</b>
            <p style={{marginTop: "0px", marginBottom: "5px"}}>{value}</p>
        </div>
    )
}

export default function HomePage() {

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
        <div>
            <Box
                background="surface-default"
                padding="6"
                borderRadius="xlarge"
                borderColor="border-subtle"
                borderWidth="1"
                style={{margin: "20px"}}
            >
                Nav logo + inntekt
            </Box>
            <Box
                background="surface-default"
                padding="6"
                borderRadius="xlarge"
                borderColor="border-subtle"
                borderWidth="1"
                style={{margin: "20px"}}
            >
                {`logo / ${mockResponseForHentingAvUklassifisertInntekt.inntektsmottaker.navn} / ${mockResponseForHentingAvUklassifisertInntekt.inntektsmottaker.pnr} / Tekst`}
            </Box>
            <Box style={{margin: "20px"}}>
                <ExpansionCard aria-label="Demo med custom styling" style={{padding: "20px"}}>
                    <ExpansionCard.Header>
                        <ExpansionCard.Title>Grav og Spreng AS</ExpansionCard.Title>
                        <ExpansionCard.Description>
                            {VariableAndAnswer("Org nummer", "924 567 834")}
                            {VariableAndAnswer("Periode", "02.25 - 10.25")}
                            {VariableAndAnswer("Beløp for perioden", "143435kr")}
                        </ExpansionCard.Description>
                    </ExpansionCard.Header>
                    <ExpansionCard.Content>
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
                    </ExpansionCard.Content>
                </ExpansionCard>

                <ExpansionCard aria-label="Demo med custom styling" style={{padding: "20px"}}>
                    <ExpansionCard.Header>
                        <ExpansionCard.Title>Flytt og dytt</ExpansionCard.Title>
                        <ExpansionCard.Description>
                            {VariableAndAnswer("Org nummer", "924 934 135")}
                            {VariableAndAnswer("Periode", "05.24 - 10.24")}
                            {VariableAndAnswer("Beløp for perioden", "254435kr")}
                        </ExpansionCard.Description>
                    </ExpansionCard.Header>
                    <ExpansionCard.Content>
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
                    </ExpansionCard.Content>
                    <LeggTilInntektsKildeModal />
                </ExpansionCard>
            </Box>
        </div>
    );
}