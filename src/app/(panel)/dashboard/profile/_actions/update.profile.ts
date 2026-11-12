
'use server'

import {auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const formSchema = z.object
  ( { name:z.string().min(1,{message:"Nome é obrigatório"}),
    address:z.string().optional(),
    phone:z.string().optional(),
    status: z.boolean(),
    timeZone: z.string().min(1,{message:"Fuso horário é obrigatório"}),
    times: z.array(z.string())
})

type FormSchema = z.infer<typeof formSchema>


export async function updatedProfile(formData: FormSchema) {

  const session = await auth()
  if(!session?.user.id){
    return {error:"Usuário não encontrado"}
  }
    
    const schema = formSchema.safeParse(formData)
     if(!schema.success){
        return{ error : "Preencha todos os campos obrigatórios corretamente"}
     }

try{
  await prisma.user.update({
    where:{
      id: session.user.id
    },
    data:{
      name: formData.name,
      address: formData.address,
      phone: formData.phone,
      status: formData.status,
      timeZone: formData.timeZone,
      times: formData.times || []
    }
  })

  revalidatePath('/dashboard/profile')

  return {
    data: "Perfil atualizado com sucesso!"
  }
}catch(error){
  return {error:"Erro ao atualizar perfil"} 
}
    

}