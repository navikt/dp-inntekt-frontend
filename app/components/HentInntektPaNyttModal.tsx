import {BodyLong, Button, Modal} from "@navikt/ds-react";
import {useInntekt} from "~/context/inntekt-context";
import {ArrowCirclepathIcon} from "@navikt/aksel-icons";
import {useRef} from "react";

interface HentInntektPaNyttModalProps {
    inntektId: string,
    state?: "idle" | "loading" | "submitting"
}

export function HentInntektPaNyttModal({inntektId, state}: HentInntektPaNyttModalProps) {
    const {setUklassifisertInntekt, setInntektEndret} = useInntekt();
    const ref = useRef<HTMLDialogElement>(null);
    var oppdateringStatus = "klar"
    const heading = "Du er i ferd med å hente inntekt på nytt fra A-Inntekt"


    async function hentUncachedInntekt() {

        oppdateringStatus = "laster"
        const response = await fetch(`/api/uncached/${inntektId}`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Feil ved henting av oppdatert inntekt");
        }
        oppdateringStatus = "klar"

        const data = await response.json();
        setUklassifisertInntekt(data)
        setInntektEndret(true);
    }

    const description = "Er du sikker på at du vil overskrive endringene?"
    return (
        <div>
            <Button type="button"
                    size="small"
                    icon={<ArrowCirclepathIcon/>}
                    loading={oppdateringStatus === "laster"}
                    onClick={() => ref.current?.showModal()}>
                Hent inntekt på nytt
            </Button>

            <Modal
                ref={ref}
                header={{
                    heading: heading,
                }}
                width="medium"
            >
                <Modal.Body>
                    <BodyLong>{description}</BodyLong>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        type="button"
                        onClick={() => {
                            hentUncachedInntekt();
                            ref?.current?.close();
                        }}
                        variant="primary"
                        size="small"
                    >
                        Bekreft
                    </Button>
                    <Button
                        type="button"
                        variant="tertiary"
                        onClick={() => ref?.current?.close()}
                        size="small"
                    >
                        Avbryt
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
}