import {Box} from "@navikt/ds-react";
import {mockResponseForHentingAvUklassifisertInntekt} from "~/utils/mock.server.response";
import InntektExpansionCard from "~/components/InntektExpansionCard";
import LeggTilInntektsKildeModal from "~/components/LeggTilInntektskildeModal";

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
            <Box style={{margin: "20px", padding: "20px"}} background="surface-default">
                {
                    data.map((virksomhet, index) => {
                        // @ts-ignore
                        return <InntektExpansionCard key={index} virksomhet={virksomhet} />
                    })
                }
                <LeggTilInntektsKildeModal />
            </Box>
        </div>
    );
}