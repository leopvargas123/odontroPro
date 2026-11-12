import { redirect } from "next/navigation"
import { format } from "date-fns"
import { getInfoSchedule } from "./_data-acess/get-info-schedule"
import { ScheduleContent } from "./_components/schedule-content"

export default async function SchedulePage({
    params,
}:{
    params:Promise<{id:string}>
}){
    
   const userId = (await params).id
    const user = await getInfoSchedule({userId:userId})

    if(!user){
        redirect("/")
    }

    const initialDate = format(new Date(), "yyyy-MM-dd")

    return(
        <ScheduleContent clinic={user} initialDate={initialDate}/>
    )
}