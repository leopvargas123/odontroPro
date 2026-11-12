
"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import {ScrollArea} from '@/components/ui/scroll-area'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from "date-fns"
import { Prisma } from "@/generated/prisma/client"
import { Button } from "@/components/ui/button"
import { Eye, X } from "lucide-react"
import { cancelAppointment } from "../../_actions/cancel-appointment"
import { toast } from "sonner"
import {
    Dialog,
    DialogTrigger
} from "@/components/ui/dialog"
import { DialogAppointment } from "./dialog-appointment"
import { ButtonPickerAppointment } from "./button-date"

export type AppoitmentWithService = Prisma.AppointmentGetPayload<{
include:{
    service: true,
}
}>

interface AppointmentsListPorps{
    times:string[]
}

export function AppointmenstList({times}: AppointmentsListPorps){

    const searchParams = useSearchParams();
    const date = searchParams.get("date")
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [ detailsAppointment, setDetailsAppointment] = useState<AppoitmentWithService | null>(null);

    const {data, isLoading, refetch} = useQuery({
        queryKey:['get-appointments', date],
        queryFn: async ()=>{
            //aqui vamos buscar da nossa rota...
            let activeDate = date;
            if(!activeDate){
                const today = format(new Date(),'yyyy-MM-dd')
                activeDate = today;
            }

            const url = `${process.env.NEXT_PUBLIC_URL}/api/clinic/appointments?date=${activeDate}`

            const response = await fetch(url)

            const json = await response.json() as AppoitmentWithService[];

            if(!response.ok){
                return []
            }
            return json;
        },

        staleTime: 20000, // 20 segundos de staleTime
        refetchInterval: 60000  // 60 segundos de refetchInterval
    })

    // Monta occupantMap slot > appointment
    // Se um Appointment começa no time (15h) e tem requiredSlots 2 
    // ocupantMap ['15:00', appointment] occupantMap["15:30", appointment]

    const occupantMap: Record<string, AppoitmentWithService> = { 

    }

    
    if(data && data.length > 0){
        //preencher os slots ocupados....
        for ( const appointment of data){
            // Calcular quantos slots necessarios ocupa
            const requiredSlots = Math.ceil(appointment.service.duration/30);
            // Descobrir qual indice do nosso array de horarios esse agendamento começa.
            const startIndex = times.indexOf(appointment.time)

            // Se encontrou o index 
            if(startIndex !== -1){
                for (let i = 0; i < requiredSlots; i++){
                    const slotIndex = startIndex + i;

                    if(slotIndex < times.length){
                      
                        occupantMap[times[slotIndex]] = appointment;
                    }
                }
            }
        }
    }

        async function handleCancelAppointment(appointmentId: string){
            const response = await cancelAppointment({appointmentId})

            if(response.error){
                toast.error(response.error);
                return;
            } 
            queryClient.invalidateQueries({queryKey:['get-appointments']})
            await refetch();
            toast.success(response.data);
        }

    return(
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
       <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl md:text-2xl font-bold">
                    Agendamentos
                </CardTitle>
                <ButtonPickerAppointment />
            </CardHeader>
            <CardContent>
                <ScrollArea className='h-[calc(100vh-20rem) lg:h-[calc(100vh-15rem)] pr-4'>
                    {isLoading ? (
                        <p>Carregando agenda...</p>
                    ):(
                        times.map((slot)=>{
                                            //occupantMap["15:00"]
                            const occupant = occupantMap[slot]

                            if(occupant){
                                return(
                                    <div 
                            className="flex items-center py-2 border-t last:border-b"
                            key={slot}>
                            <div className="w-16 text-sm font-semibold">
                                {slot}
                            </div>
                            <div className="flex-1 text-lg"><div className="font-semibold">{occupant.name}
                                </div><div className="text-sm text-gray-500">{occupant.phone}
                                    </div>
                                </div>

                                    <div className="ml-auto">
                                       <div className="flex gap-2">
                                        <DialogTrigger render={
                                             <Button 
                                        onClick={() => setDetailsAppointment(occupant)}
                                         variant="ghost"
                                         size="icon">
                                            <Eye className="h-4 w-4"/>
                                        </Button>
                                        }/>
                                         <Button 
                                         variant="ghost"
                                         size="icon"
                                         onClick={() => handleCancelAppointment(occupant.id)}
                                         >
                                            <X className="h-4 w-4"/>
                                        </Button>

                                       </div>
                                    </div>
                        </div>
                                )
                            }

                        return(
                            <div 
                            className="flex items-center py-2 border-t last:border-b"
                            key={slot}>
                            <div className="w-16 text-sm font-semibold">
                                {slot}
                            </div>
                            <div className="flex-1 text-sm text-gray-500">Disponível</div>
                        </div>
                        )
                    })
                    )}
                </ScrollArea>
            </CardContent>
       </Card>
       <DialogAppointment 
       appointment={detailsAppointment}
       />
       </Dialog>
    )
}