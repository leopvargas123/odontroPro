'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

interface useProfileFormProps {
    name: string | null;
    address: string | null;
    phone: string | null;
    status: boolean | null;
    timeZone: string | null;

}

const profileFormSchema = z.object({
    name:z.string().min(1,{message:"Nome é obrigatório"}).max(100,{message:"Nome muito grande"}),
    address:z.string().optional(),
    phone:z.string().optional(),
    status: z.string(),
    timeZone: z.string().min(1,{message:"Fuso horário é obrigatório"})
})

export type ProfileFormData = z.infer<typeof profileFormSchema>;

export function useProfileForm({name, address, phone, status, timeZone}: useProfileFormProps){
    return useForm<ProfileFormData>({
        resolver: zodResolver(profileFormSchema),
        defaultValues:{
            name:name || '',
            address:address || '',
            phone:phone || '',
            status:status ? 'ATIVO (CLINICA ABERTA)' : 'INATIVO (CLINICA FECHADA)',
            timeZone:timeZone || ''
        }
    })
}