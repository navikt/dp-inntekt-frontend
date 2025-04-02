import {Box, Button, ExpansionCard, Table} from "@navikt/ds-react";
import {mockResponseForHentingAvUklassifisertInntekt} from "~/utils/mock.server.response";
import {PlusCircleIcon} from "@navikt/aksel-icons";
import LeggTilInntektsKildeModal from "~/components/LeggTilInntektskildeModal";
import VirksomhetExpansion from "~/components/VirksomhetExpansion";

export function VariableAndAnswer(name: string, value: string) {
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
            "virksomhetsnummer": "924567834",
            "navn": "Grav og Spreng AS",
            "periode": {
                "fra": new Date("2024-02-01"),
                "til": new Date("2024-10-01")
            },
            "inntekter": [
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
                    "redigert": "Ja",
                    "begrunnelse": "Dårlige data",
                    "b": "-",
                    "beløp": "1 400kr",
                }
            ]
        },
        {
            "virksomhetsnummer": "924567834",
            "navn": "Grav og Spreng AS",
            "periode": {
                "fra": new Date("2022-11-01"),
                "til": new Date("2025-03-01")
            },
            "inntekter": [
                {
                    "inntektstype": "Timelønn",
                    "kilde": "A-Inntekt",
                    "sistOppdatert": "00.00.0000",
                    "redigert": "Nei",
                    "begrunnelse": "-",
                    "b": "-",
                    "beløp": "59 500kr",
                }
            ]
        },
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
                {
                    data.map((virksomhet, index) => {
                        return (<VirksomhetExpansion key={index} virksomhet={virksomhet}/>)
                    })
                }
            </Box>
        </div>
    );
}