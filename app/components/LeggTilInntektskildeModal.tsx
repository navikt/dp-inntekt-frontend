import {
    Button,
    DatePicker, HStack, Label,
    Modal,
    Radio,
    RadioGroup, Select,
    TextField,
    useDatepicker,
    useRangeDatepicker
} from "@navikt/ds-react";
import {useRef} from "react";
import {PlusCircleIcon} from "@navikt/aksel-icons";
import InntektPeriodeIModalen from "~/components/InntektPeriodeIModalen";

export default function LeggTilInntektsKildeModal () {
    const ref = useRef<HTMLDialogElement>(null);

    const { datepickerProps, toInputProps, fromInputProps, selectedRange } =
        useRangeDatepicker({
            fromDate: new Date("Aug 23 2019"),
            onRangeChange: console.info,
        });


    return (
        <div className="py-12">
            <Button variant="primary" icon={<PlusCircleIcon aria-hidden />} onClick={() => ref.current?.showModal()} style={{margin: "10px"}}>
                Legg til inntektskilde
            </Button>


            <Modal ref={ref} header={{ heading: "Inntektskilde og inntekt" }} width={"medium"}>
                <Modal.Body>
                    <form method="dialog" id="skjema">
                        <RadioGroup legend="Type inntektskilde" >
                            <Radio value="norskVirksomhet">Norsk virksomhet</Radio>
                            <Radio value="utenlandsVirksomhet">Utenlands virksomhet</Radio>
                            <Radio value="privatPerson">Privat person</Radio>
                        </RadioGroup>

                        <TextField label="Arbeidsgiver" />
                        <TextField label="Organisasjonsnummer" />
                        <DatePicker {...datepickerProps}>
                            <HStack wrap gap="4" justify="center">
                                <DatePicker.Input {...fromInputProps} label="Fra" />
                                <DatePicker.Input {...toInputProps} label="Til" />
                            </HStack>
                        </DatePicker>

                        <Select label="Inntektstype">
                            <option value="timelonn">Timelønn</option>
                            <option value="fastlonn">Fastlønn</option>
                            <option value="lonnEOS">Lønn EØS</option>
                            <option value="ElektroniskKom">Elektrisk kommunikasjon</option>
                        </Select>

                        <div>
                            <Label>Periode</Label>
                            <InntektPeriodeIModalen />
                        </div>
                        <TextField label="Begrunnelse" />



                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button form="skjema">Lagre</Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => ref.current?.close()}
                    >
                        Avbryt
                    </Button>
                    <Button variant="tertiary">Lukk</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};