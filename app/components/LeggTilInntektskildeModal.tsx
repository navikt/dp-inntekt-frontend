import {Button, Modal, TextField} from "@navikt/ds-react";
import {useRef} from "react";
import {PlusCircleIcon} from "@navikt/aksel-icons";

export default function LeggTilInntektsKildeModal () {
    const ref = useRef<HTMLDialogElement>(null);


    return (
        <div className="py-12">
            <Button variant="primary" icon={<PlusCircleIcon aria-hidden />} onClick={() => ref.current?.showModal()} style={{margin: "10px"}}>
                Legg til inntektskilde
            </Button>


            <Modal ref={ref} header={{ heading: "Skjema" }} width={400}>
                <Modal.Body>
                    <form method="dialog" id="skjema" onSubmit={() => alert("onSubmit")}>
                        <TextField label="Har du noen tilbakemeldinger?" />
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button form="skjema">Send</Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => ref.current?.close()}
                    >
                        Avbryt
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};