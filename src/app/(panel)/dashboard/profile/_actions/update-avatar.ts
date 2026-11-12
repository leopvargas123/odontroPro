'use server'

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function updateProfileAvatar({avatarUrl}: {avatarUrl: string }) {
    const session = await auth();

    if(!session?.user?.id) {
        return{ error: 'Usuário não encontrado.'}
    }
    if(!avatarUrl){
        return { error: 'Falha ao alterar a imagem do avatar.'}
    }
    try{

        await prisma.user.update({
            where: { id: session?.user?.id },
            data: { image: avatarUrl },
        })

        revalidatePath('/dashboard/profile');

        return { data: 'Imagem do avatar alterada com sucesso.'}

    }catch(error){
        return { error: 'Falha ao alterar a imagem do avatar.'}
    }
}