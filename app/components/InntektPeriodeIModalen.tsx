import {Button, TextField} from "@navikt/ds-react";
import {useState} from "react";
import {ArrowLeftIcon, ArrowRightIcon} from "@navikt/aksel-icons";

enum Maned {
    Januar, Februar, Mars, April, Mai, Juni, Juli, August, September, Oktober, November, Desember
}

type ManedInntekt = {
    maned: String;
    inntekt: number;
}

type arsInntekt = {
    maneder: ManedInntekt[];
    ar: string;
}

const inntekterPropsMockData : arsInntekt[] = [
    {
        ar : "2025",
        maneder: [
            {maned: "Januar", inntekt: 10000},
            {maned: "Februar", inntekt: 12000},
            {maned: "Mars", inntekt: 11000},
            {maned: "April", inntekt: 13000},
            {maned: "Mai", inntekt: 0},
            {maned: "Juni", inntekt: 0},
            {maned: "Juli", inntekt: 0},
            {maned: "August", inntekt: 0},
            {maned: "September", inntekt: 0},
            {maned: "Oktober", inntekt: 0},
            {maned: "November", inntekt: 0},
            {maned: "Desember", inntekt: 0}

        ],
    },
    {
        ar : "2024",
        maneder: [
            {maned: "Januar", inntekt: 10000},
            {maned: "Februar", inntekt: 12000},
            {maned: "Mars", inntekt: 11000},
            {maned: "April", inntekt: 13000},
            {maned: "Mai", inntekt: 14000},
            {maned: "Juni", inntekt: 15000},
            {maned: "Juli", inntekt: 16000},
            {maned: "August", inntekt: 17000},
            {maned: "September", inntekt: 18000},
            {maned: "Oktober", inntekt: 19000},
            {maned: "November", inntekt: 20000},
            {maned: "Desember", inntekt: 21000}
        ],
    },
    {
        ar : "2023",
        maneder: [
            {maned: "Januar", inntekt: 10000},
            {maned: "Februar", inntekt: 12000},
            {maned: "Mars", inntekt: 11000},
            {maned: "April", inntekt: 13000},
            {maned: "Mai", inntekt: 14000},
            {maned: "Juni", inntekt: 15000},
            {maned: "Juli", inntekt: 16000},
            {maned: "August", inntekt: 17000},
            {maned: "September", inntekt: 18000},
            {maned: "Oktober", inntekt: 19000},
            {maned: "November", inntekt: 20000},
            {maned: "Desember", inntekt: 21000}
        ]
    },
    {
        ar : "2022",
        maneder: [
            {maned: "Januar", inntekt: 10000},
            {maned: "Februar", inntekt: 12000},
            {maned: "Mars", inntekt: 11000},
            {maned: "April", inntekt: 13000},
            {maned: "Mai", inntekt: 14000},
            {maned: "Juni", inntekt: 15000},
            {maned: "Juli", inntekt: 16000},
            {maned: "August", inntekt: 17000},
            {maned: "September", inntekt: 18000},
            {maned: "Oktober", inntekt: 19000},
            {maned: "November", inntekt: 20000},
            {maned: "Desember", inntekt: 21000}
        ],
    }
]


export default function InntektPeriodeIModalen() {
    const [ar, setAr] = useState<string>(inntekterPropsMockData.sort((a, b) => parseInt(a.ar) - parseInt(b.ar))[0].ar);
    const [inntektsmaneder, setInntektsmaneder] = useState<ManedInntekt[]>(inntekterPropsMockData[0].maneder);


    function totaltSumForManed(): String {
        var sum: number = 0;
        inntektsmaneder.map((manedData) => {
            sum += manedData.inntekt
        })

        return sum + " kr"
    }

    function forrigeAr() {
        const index = inntekterPropsMockData.findIndex((inntekt) => inntekt.ar === ar);
        if (index > 0) {
            setAr(inntekterPropsMockData[index - 1].ar);
            setInntektsmaneder(inntekterPropsMockData[index - 1].maneder);
        }
    }

    function nesteAr() {
        const index = inntekterPropsMockData.findIndex((inntekt) => inntekt.ar === ar);
        if (index < inntekterPropsMockData.length - 1) {
            setAr(inntekterPropsMockData[index + 1].ar);
            setInntektsmaneder(inntekterPropsMockData[index + 1].maneder);
        }
    }

    //Dette er alternativt for headern, der knappene ligner mer på skissene.
    function alternativeHeaderForTimePeriod() {
        return (
            <>
                <button style={{background: "none", border: "none", cursor: "pointer"}} onClick={forrigeAr}>
                    <ArrowLeftIcon />
                </button>
                <h3>{ar}</h3>
                <button style={{background: "none", border: "none", cursor: "pointer"}} onClick={nesteAr}>
                    <ArrowRightIcon />
                </button>
            </>
        )
    }

    function handleInntektChange(event: React.ChangeEvent<HTMLInputElement>, index: number) {
        const newInntektsmaneder = [...inntektsmaneder];
        newInntektsmaneder[index].inntekt = parseInt(event.target.value);
        setInntektsmaneder(newInntektsmaneder);
    }


    // Når man trykker på knappene for forrige/neste år, så oppdateres inntektsmanedene og ar i henhold til det valgte året, men modalen lukker seg,
    // Så sikkert noe som ikke er helt riktig med state oppdateringen.
    return (
       <div style={{padding: "10px", borderColor: "border-subtle", borderWidth: "1px", borderStyle: "solid", borderRadius: "10px"}}>
           <div style={{display: "flex", justifyContent: "space-between"}}>
               <Button icon={<ArrowLeftIcon />} variant="tertiary" disabled={inntekterPropsMockData[0].ar === ar} onClick={forrigeAr}/>
               <h3>{ar}</h3>
               <Button icon={<ArrowRightIcon />} variant="tertiary" disabled={inntekterPropsMockData[inntekterPropsMockData.length-1].ar === ar } onClick={nesteAr}/>
           </div>
           <div style={{
               display: "grid",
               gridTemplateColumns: "repeat(6, 1fr)",
               gap: "10px",
           }}>
               {
                   inntektsmaneder.map((manedData, index) => {
                       return <TextField key={index} label={manedData.maned} value={manedData.inntekt} size="small"
                                         onChange={(event) => handleInntektChange(event, index)} />
                   })
               }
           </div>
           <TextField value={totaltSumForManed()} size="small" readOnly />
       </div>
    )
}
