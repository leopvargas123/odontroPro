'use client'

import { Button } from "@/components/ui/button"
import { ReminderFormdata, useReminderForm } from "./reminder-form"
import { Form, FormItem, FormField, FormControl, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useWatch } from "react-hook-form"
import { createReminder } from "../../_actions/create-reminder"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface ReminderContentProps{
    closeDialog: ()=> void;
    }

export function ReminderContent( {closeDialog} : ReminderContentProps){

    const form = useReminderForm()
    const router = useRouter()

    const description = useWatch({
        control: form.control,
        name: "description",
    })

    async function onSubmit(formData: ReminderFormdata){
        
        const response = await createReminder({description:formData.description})

        if(response.error){
            toast.error(response.error)
            return;
        }

        toast.success(response.data)
        router.refresh();
        closeDialog()
    }

    return(
        <div className="grid gap-4 py-4">
           <Form {...form}>
                <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4">
                    <FormField
                    control={form.control}
                    name="description"
                    render={({field}) =>(
                        <FormItem>
                            <FormLabel>Descreva o lembrete:</FormLabel>
                            <FormControl>
                                <Textarea
                                {...field}
                                className="max-h-52 "
                                placeholder="Digite o nome do lembrete..."
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                    <Button 
                    disabled={!description?.trim()}
                    type="submit">
                        Cadastrar lembrete
                    </Button>
                </form>
            </Form> 
        </div>
    )
}