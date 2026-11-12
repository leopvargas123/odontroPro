'use client'
import { useState } from "react"
import DatePicker, { registerLocale} from 'react-datepicker'
import { ptBR} from 'date-fns/locale/pt-BR'
import { pt } from "zod/v4/locales"
import 'react-datepicker/dist/react-datepicker.css'

registerLocale("pt-BR",ptBR)

interface DateTimePickerProps{
    minDate?:Date;
    className?:string;
    initialDate:Date,
    onChange: (date: Date)=> void;
}

export function DateTimePicker({className,minDate,initialDate,onChange}:DateTimePickerProps){
    const [startDate, setStartDate] = useState(initialDate)

    function handleChange(date:Date | null){
        if(date){
            setStartDate(date)
            onChange(date)
        }
    }

    return(
        <DatePicker
        className={className}
        selected={startDate}
        locale='pt-BR'
        minDate={minDate ?? initialDate}
        onChange={handleChange}
        dateFormat='dd/MM/yyyy'
        />
    )
}