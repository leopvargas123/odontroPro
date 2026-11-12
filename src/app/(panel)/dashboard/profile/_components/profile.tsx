'use client'
import { ProfileFormData, useProfileForm } from './profile-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import imgTest from '../../../../../../public/foto1.png'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Prisma } from '@/generated/prisma/browser'
import { updatedProfile } from '../_actions/update.profile'
import { toast } from 'sonner'
import { formatPhone, extractPhoneNumber } from '@/utils/formatPhone'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AvatarProfile } from './profile-avatar'



type UserWithSubscription = Prisma.UserGetPayload<{
    include:{
        subscription: true
    }
}>

interface ProfileContentProps {
    user: UserWithSubscription
}

export function ProfileContent({user}:ProfileContentProps){
    const router = useRouter()
    const [selectedHours, setSelectedHours] = useState<string[]>(user.times || []);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { update } = useSession()


    const form = useProfileForm({
        name: user.name,
        address: user.address,
        phone: user.phone,
        status: user.status,
        timeZone: user.timeZone
    });

    function generateTimeSlots(): string[] {
        const hours: string[] = [];
        for (let i = 8; i <= 24; i++) {
          const hour = i.toString().padStart(2, '0');
          hours.push(`${hour}:00`);
          hours.push(`${hour}:30`);
          
        }
        return hours;
    }

    const hours = generateTimeSlots();

    function toggleHour(hour: string) {
        setSelectedHours((prev)=> prev.includes(hour) ? prev.filter(h => h !== hour) : [...prev, hour].sort());
    }

    const timeZones = Intl.supportedValuesOf('timeZone').filter((zone)=>
        zone.startsWith('America/Sao_Paulo') || 
        zone.startsWith('America/Bahia')    ||
         zone.startsWith('America/Recife') || 
        zone.startsWith('America/Fortaleza') || 
        zone.startsWith('America/Cuiaba') || 
        zone.startsWith('America/Porto_Velho') || 
        zone.startsWith('America/Manaus') || 
        zone.startsWith('America/Belem') 
    );

    async function onSubmit(values: ProfileFormData){
        
        const extractValue = extractPhoneNumber(values.phone || '');

       const response = await updatedProfile({
        name: values.name,
        address: values.address,
        phone: values.phone,
        status: values.status === 'ATIVO (CLINICA ABERTA)' ? true : false,
        timeZone: values.timeZone,
        times: selectedHours || []
       })
       if(response.error){
        toast.error(response.error,)
        return;
       }
       toast.success(response.data)
    }

    async function handleLogout(){
        await signOut();
        await update();
        router.replace('/')
    }

 return (
    <div className='mx-auto'>
        <Form{...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Meu perfil</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                        <div className='flex justify-center'>
                            <AvatarProfile
                                avatarUrl={user.image}
                            />
                        </div>
                        
                        <div className='space-y-4 '>

                            <FormField
                            control={form.control}
                            name='name'
                            render={({field})=> (
                                <FormItem>
                                    <FormLabel className='font-semibold'>Nome completo:</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Digite o nome da clinica' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />

                                     <FormField
                            control={form.control}
                            name='address'
                            render={({field})=> (
                                <FormItem>
                                    <FormLabel className='font-semibold'>Endereço completo:</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Digite o endereço da clinica' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />

                                     <FormField
                            control={form.control}
                            name='phone'
                            render={({field})=> (
                                <FormItem>
                                    <FormLabel className='font-semibold'>Telefone:</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Digite o telefone da clinica' {...field} 
                                                onChange={(e)=>{
                                                    const formatedValue = formatPhone(e.target.value)
                                                    field.onChange(formatedValue);
                                                }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />

                                     <FormField
                            control={form.control}
                            name='status'
                            render={({field})=> (
                                <FormItem>
                                    <FormLabel className='font-semibold'>Status da clinica:</FormLabel>
                                    <FormControl>

                                    <Select
                                        value={field.value || 'ATIVO (CLINICA ABERTA)'}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Selecione o status da clinica' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='ATIVO (CLINICA ABERTA)'>ATIVO (Clinica aberta)</SelectItem>
                                            <SelectItem value='INATIVO (CLINICA FECHADA)'>INATIVO (Clinica fechada)</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    </FormControl>
                                </FormItem>
                            )}
                            />

                            <div className='space-y-2'>
                                <Label className='font-semibold'>
                                    Configurar horários da clinica:
                                </Label>

                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogTrigger render={
                                        <Button variant="outline" className='w-full justify-between'>
                                            Clique aqui para selecionar os horários
                                            <ArrowRight className='w-5 h-5' />
                                        </Button>
                                    } />
                                       
                                    <DialogContent className=''>
                                        <DialogHeader>
                                            <DialogTitle>Horários da clinica</DialogTitle>
                                            <DialogDescription>
                                                Selecione abaixo os horários de funcionamento da clinica.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <section className='py-4 '>
                                            <p className='text-sm text-muted-foreground mb-2'>
                                                Clique nos horarios abaixo para marcar ou desmcarcar:
                                            </p>

                                            <div className='grid grid-cols-5 gap-2 '>
                                                {hours.map((hour) => (
                                                    <Button 
                                                    key={hour} 
                                                    variant="outline" 
                                                    className={cn('h-10', selectedHours.includes(hour) &&  ' border-2 border-emerald-500 text-primary' )}
                                                    onClick={() => toggleHour(hour)}>
                                                        {hour}
                                                    </Button>
                                                ))}
                                            </div>

                                        </section>
                                        
                                        <Button 
                                        className='w-full' 
                                        onClick={() => setIsDialogOpen(false)}>
                                            Salvar horários
                                        </Button>

                                    </DialogContent>
                                </Dialog>

                            </div>


                                    <FormField
                            control={form.control}
                            name='timeZone'
                            render={({field})=> (
                                <FormItem>
                                    <FormLabel className='font-semibold'>Selecione o horário:</FormLabel>
                                    <FormControl>

                                    <Select
                                        value={field.value || 'America/Sao_Paulo'}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Selecione o seu fuso horário' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {timeZones.map((zone) => (
                                                <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    </FormControl>
                                </FormItem>
                            )}
                            />

                            <Button
                            type='submit'
                            className='w-full bg-emerald-500 hover:bg-emerald-400'
                            >
                                Salvar alterações
                            </Button>

                        </div>
                    </CardContent>
                </Card>
            </form>
        </Form>

        <section className='mt-4'>
            <Button
            variant='destructive'
            onClick={handleLogout}
            >
                Sair da Conta
            </Button>
        </section>
    </div>
 )
} 