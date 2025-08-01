import {BodyLong, Button, Modal} from "@navikt/ds-react";
import {useInntekt} from "~/context/inntekt-context";
import {ArrowsCirclepathIcon} from "@navikt/aksel-icons";
import {useRef, useState} from "react";

interface HentInntektPaNyttModalProps {
    inntektId: string,
}

export function HentInntektPaNyttModal({inntektId}: HentInntektPaNyttModalProps) {
    const {setUklassifisertInntekt, setInntektEndret} = useInntekt();
    const ref = useRef<HTMLDialogElement>(null);
    const heading = "Du er i ferd med å hente inntekt på nytt fra A-Inntekt"
    const [laster, setLaster] = useState(false);

    async function hentUncachedInntekt() {
        setLaster(true);
        await fetch(`/api/uncached/${inntektId}`, {
            method: "GET",
        })
            .then(response => response.json())
            .then(data => setUklassifisertInntekt(data))
            .finally(() => {
                setLaster(false)
                setInntektEndret(true);
                ref?.current?.close();
            })
    }

    return (
        <div>
            <Button type="button"
                    size="small"
                    variant="secondary"
                    icon={<ArrowsCirclepathIcon />}
                    onClick={() => ref.current?.showModal()}
                    >
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
                    <BodyLong>Å hente inntekt på nytt fra A-inntekt vil føre til at alle manuelle endringer blir slettet. Er du sikker på at du vil overskrive endringene?</BodyLong>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        type="button"
                        onClick={() => {
                            hentUncachedInntekt();
                        }}
                        variant="primary"
                        size="small"
                        loading={laster}
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