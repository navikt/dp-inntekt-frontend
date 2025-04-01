import {Button, Modal, TextField} from "@navikt/ds-react";
import {useRef} from "react";

export default function LeggTilInntektsKildeModal () {
    const ref = useRef<HTMLDialogElement>(null);


    return (
        <div className="py-12">
            <Button onClick={() => ref.current?.showModal()}>Åpne modal</Button>


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