import {Button, ExpansionCard, Table} from "@navikt/ds-react";
import {VariableAndAnswer} from "~/routes/_index";

interface VirksomhetPeriode {
    fra: Date;
    til: Date;
}

interface Inntekt {
    inntektstype: string;
    kilde: string;
    sistOppdatert: string;
    redigert: string;
    begrunnelse: string;
    b: string;
    beløp: string;
}

interface Virksomhet {
    virksomhetsnummer: string;
    navn: string;
    periode: VirksomhetPeriode;
    inntekter: Inntekt[];
}

interface VirksomhetExpansionProps {
    virksomhet: Virksomhet;
}

const lesbarPeriode = (periode: VirksomhetPeriode) => {
    const fraMånedOgÅr = `${(periode.fra.getMonth() + 1).toString().padStart(2, '0')}.${periode.fra.getFullYear()}`;
    const tilMånedOgÅr = `${(periode.til.getMonth() + 1).toString().padStart(2, '0')}.${periode.til.getFullYear()}`;

    return `${fraMånedOgÅr} - ${tilMånedOgÅr}`;
}

const beløpForPerioden = (inntekter: Inntekt[]) => {
    return inntekter.reduce((total, inntekt) => {
        const beløp = parseFloat(inntekt.beløp.replace(/\D/g, ""));
        return total + (isNaN(beløp) ? 0 : beløp);
    }, 0);
}

const formaterBeløp = (beløp: number) => {
    return `${beløp.toLocaleString("no-NO")} kr`;
}

const VirksomhetExpansion = ({virksomhet}: VirksomhetExpansionProps) => {
    return (<ExpansionCard aria-label="Demo med custom styling" style={{padding: "20px"}}>
        <ExpansionCard.Header>
            <ExpansionCard.Title>Grav og Spreng AS</ExpansionCard.Title>
            <ExpansionCard.Description>
                {VariableAndAnswer("Org.nummer", virksomhet.virksomhetsnummer)}
                {VariableAndAnswer("Periode", lesbarPeriode(virksomhet.periode))}
                {VariableAndAnswer("Beløp for perioden", `${formaterBeløp(beløpForPerioden(virksomhet.inntekter))}`)}
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
                    {virksomhet.inntekter.map(it => {
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
    </ExpansionCard>)
}

export default VirksomhetExpansion;